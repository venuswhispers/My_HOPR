import BN = require("bn.js");
import {
  PaymentChannelContract,
  PaymentChannelInstance,
  HoprTokenContract,
  HoprTokenInstance
} from "../../../types/truffle-contracts";
import { signPayment, recoverSigner } from "./utils";
import { PromiseType } from "../../../types/typescript";
import { time, expectEvent, expectRevert } from "@openzeppelin/test-helpers";

const HoprToken: HoprTokenContract = artifacts.require("HoprToken");

const PaymentChannel: PaymentChannelContract = artifacts.require(
  "PaymentChannel"
);

// taken from "scripts/test.sh"
const senderPrivKey =
  "0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501200";

const formatChannel = (
  res: PromiseType<PaymentChannelInstance["channels"]>
) => ({
  deposit: res[0],
  closureTime: res[1],
  isOpen: res[2]
});

const PrintGasUsed = (name: string) => (
  response: Truffle.TransactionResponse
) => {
  console.log(`gas used in '${name}'`, response.receipt.gasUsed);
  return response;
};

contract("PaymentChannel", function([sender, recipient, randomUser]) {
  const depositAmount = web3.utils.toWei("1", "ether");
  let hoprToken: HoprTokenInstance;
  let paymentChannel: PaymentChannelInstance;
  let totalSupply: string;

  const reset = async () => {
    hoprToken = await HoprToken.new();
    // mint supply
    await hoprToken.mint(sender, web3.utils.toWei("100000000", "ether"));
    totalSupply = await hoprToken.totalSupply().then(res => res.toString());

    paymentChannel = await PaymentChannel.new(
      hoprToken.address,
      time.duration.days(2)
    );
  };

  // reset contracts for every test
  describe("unit tests", function() {
    beforeEach(async function() {
      await reset();
    });

    it("should have created channel correctly", async function() {
      await hoprToken.approve(paymentChannel.address, depositAmount);

      const response = await paymentChannel.createChannel(
        sender,
        sender,
        recipient,
        depositAmount
      );

      expectEvent(response, "OpenedChannel", {
        funder: sender,
        sender,
        recipient,
        deposit: depositAmount
      });

      const channel = await paymentChannel
        .channels(sender, recipient)
        .then(formatChannel);

      expect(channel.deposit.eq(new BN(depositAmount))).to.be.equal(
        true,
        "wrong deposit"
      );
      expect(channel.closureTime.isZero()).to.be.equal(
        true,
        "wrong closureTime"
      );
      expect(channel.isOpen).to.be.equal(true, "wrong isOpen");
    });

    it("payment 'signer' should be 'sender'", async function() {
      const payment = signPayment(
        web3,
        senderPrivKey,
        paymentChannel.address,
        web3.utils.toWei("1", "ether").toString()
      );

      const signer = recoverSigner(web3, payment.message, payment.signature);

      expect(signer).to.be.eq(sender, "wrong signer");
    });

    it("should fail when creating an open channel a second time", async function() {
      await hoprToken.approve(paymentChannel.address, depositAmount);

      await paymentChannel.createChannel(
        sender,
        sender,
        recipient,
        depositAmount
      );

      await expectRevert(
        paymentChannel.createChannel(sender, sender, recipient, depositAmount),
        "channel is not closed"
      );
    });

    it("should fail when 'sender' is calling 'closeChannel'", async function() {
      await hoprToken.approve(paymentChannel.address, depositAmount);

      await paymentChannel.createChannel(
        sender,
        sender,
        recipient,
        depositAmount
      );

      const payment = signPayment(
        web3,
        senderPrivKey,
        paymentChannel.address,
        web3.utils.toWei("1", "ether").toString()
      );

      await expectRevert(
        paymentChannel.closeChannel(sender, depositAmount, payment.signature, {
          from: sender
        }),
        "channel must be 'open' or 'pending for closure'"
      );
    });

    it("should fail when 'claimChannelClosure' before closureTime", async function() {
      await hoprToken.approve(paymentChannel.address, depositAmount);

      await paymentChannel.createChannel(
        sender,
        sender,
        recipient,
        depositAmount
      );

      await paymentChannel.initiateChannelClosure(recipient, {
        from: sender
      });

      await expectRevert(
        paymentChannel.claimChannelClosure(recipient, depositAmount, {
          from: sender
        }),
        "'closureTime' has not passed"
      );
    });

    it("should fail when calling 'initiateChannelClosure' from 'randomUser'", async function() {
      await hoprToken.approve(paymentChannel.address, depositAmount);

      await paymentChannel.createChannel(
        sender,
        sender,
        recipient,
        depositAmount
      );

      await expectRevert(
        paymentChannel.initiateChannelClosure(recipient, {
          from: randomUser
        }),
        "channel is not open"
      );
    });

    it("should fail when calling 'claimChannelClosure' from 'randomUser'", async function() {
      await hoprToken.approve(paymentChannel.address, depositAmount);

      await paymentChannel.createChannel(
        sender,
        sender,
        recipient,
        depositAmount
      );

      await paymentChannel.initiateChannelClosure(recipient, {
        from: sender
      });

      await expectRevert(
        paymentChannel.claimChannelClosure(recipient, depositAmount, {
          from: randomUser
        }),
        "channel is not pending for closure"
      );
    });

    it("should fail 'createChannel' when token balance too low'", async function() {
      await hoprToken.approve(paymentChannel.address, depositAmount);
      await hoprToken.burn(totalSupply, {
        from: sender
      });

      await expectRevert(
        paymentChannel.createChannel(sender, sender, recipient, depositAmount, {
          from: sender
        }),
        "SafeERC20: low-level call failed"
      );
    });
  });

  // reset contracts once
  describe("integration tests", function() {
    before(async function() {
      await reset();
      await hoprToken.approve(paymentChannel.address, totalSupply);
    });

    it("should send 0.2 HOPR to 'recipient' and 0.8 HOPR to 'sender'", async function() {
      await paymentChannel
        .createChannel(sender, sender, recipient, depositAmount)
        .then(PrintGasUsed("createChannel first time"));

      const amount = web3.utils.toWei("0.2", "ether");

      const payment = signPayment(
        web3,
        senderPrivKey,
        paymentChannel.address,
        amount
      );

      const response = await paymentChannel
        .closeChannel(sender, amount, payment.signature, {
          from: recipient
        })
        .then(PrintGasUsed("closeChannel first time"));

      expectEvent(response, "ClosedChannel", {
        sender,
        recipient,
        senderAmount: web3.utils.toWei("0.8", "ether").toString(),
        recipientAmount: web3.utils.toWei("0.2", "ether").toString()
      });

      const channel = await paymentChannel
        .channels(sender, recipient)
        .then(formatChannel);

      expect(channel.isOpen).to.be.equal(false, "wrong isOpen");

      const senderBalance = await hoprToken.balanceOf(sender);
      const recipientBalance = await hoprToken.balanceOf(recipient);
      const paymentChannelBalance = await hoprToken.balanceOf(
        paymentChannel.address
      );

      const expectedSenderBalance = new BN(totalSupply).sub(
        new BN(web3.utils.toWei("0.2", "ether"))
      );
      const expectedRecipientBalance = new BN(web3.utils.toWei("0.2", "ether"));

      expect(senderBalance.eq(expectedSenderBalance)).to.be.equal(
        true,
        "wrong senderBalance"
      );
      expect(recipientBalance.eq(expectedRecipientBalance)).to.be.equal(
        true,
        "wrong recipientBalance"
      );
      expect(paymentChannelBalance.isZero()).to.be.equal(
        true,
        "wrong paymentChannelBalance"
      );
    });

    it("should send 0.8 HOPR to 'recipient' and 0.2 HOPR to 'sender' by closure", async function() {
      await paymentChannel
        .createChannel(sender, sender, recipient, depositAmount)
        .then(PrintGasUsed("createChannel second time"));

      const response = await paymentChannel
        .initiateChannelClosure(recipient)
        .then(PrintGasUsed("initiateChannelClosure"));

      expectEvent(response, "InitiatedChannelClosure", {
        sender,
        recipient
      });

      await time.increase(time.duration.days(3));
      const response2 = await paymentChannel
        .claimChannelClosure(recipient, web3.utils.toWei("0.8", "ether"))
        .then(PrintGasUsed("claimChannelClosure"));

      expectEvent(response2, "ClosedChannel", {
        sender,
        recipient,
        senderAmount: web3.utils.toWei("0.2", "ether").toString(),
        recipientAmount: web3.utils.toWei("0.8", "ether").toString()
      });

      const channel = await paymentChannel
        .channels(sender, recipient)
        .then(formatChannel);

      expect(channel.isOpen).to.be.equal(false, "wrong isOpen");

      const senderBalance = await hoprToken.balanceOf(sender);
      const recipientBalance = await hoprToken.balanceOf(recipient);
      const paymentChannelBalance = await hoprToken.balanceOf(
        paymentChannel.address
      );

      const expectedSenderBalance = new BN(totalSupply).sub(
        new BN(web3.utils.toWei("1", "ether"))
      );
      const expectedRecipientBalance = new BN(web3.utils.toWei("1", "ether"));

      expect(senderBalance.eq(expectedSenderBalance)).to.be.equal(
        true,
        "wrong senderBalance"
      );
      expect(recipientBalance.eq(expectedRecipientBalance)).to.be.equal(
        true,
        "wrong recipientBalance"
      );
      expect(paymentChannelBalance.isZero()).to.be.equal(
        true,
        "wrong paymentChannelBalance"
      );
    });
  });
});