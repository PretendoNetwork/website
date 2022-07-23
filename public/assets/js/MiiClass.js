// Fetched from https://github.com/PretendoNetwork/account/blob/master/src/mii.js on 2021-12-16

const KaitaiStream = require('kaitai-struct/KaitaiStream');

class Mii extends KaitaiStream {
	constructor(arrayBuffer, byteOffset) {
		super(arrayBuffer, byteOffset);

		this.decode();
	}

	decode() {
		// Decode raw data
		// A lot of this goes unused
		this.unknown1 = this.readU1();
		this.characterSet = this.readBitsIntBe(2);
		this.regionLock = this.readBitsIntBe(2);
		this.profanityFlag = this.readBitsIntBe(1) !== 0;
		this.copying = this.readBitsIntBe(1) !== 0;
		this.unknown2 = this.readBitsIntBe(2);
		this.slotIndex = this.readBitsIntBe(4);
		this.pageIndex = this.readBitsIntBe(4);
		this.version = this.readBitsIntBe(4);
		this.unknown3 = this.readBitsIntBe(4);
		this.systemId = Array(8).fill().map(() => this.readU1());
		this.avatarId = Array(4).fill().map(() => this.readU1());
		this.clientId = Array(6).fill().map(() => this.readU1());
		this.padding = this.readU2le();
		this.miiMetaData = this.readU2le();
		this.miiName = Buffer.from(this.readBytes(20)).toString('utf16le');
		this.height = this.readU1();
		this.build = this.readU1();
		this.faceColor = this.readBitsIntBe(3);
		this.faceType = this.readBitsIntBe(4);
		this.mingle = this.readBitsIntBe(1) !== 0;
		this.faceMakeup = this.readBitsIntBe(4);
		this.faceWrinkles = this.readBitsIntBe(4);
		this.alignToByte();
		this.hairType = this.readU1();
		this.unknown5 = this.readBitsIntBe(4);
		this.hairFlip = this.readBitsIntBe(1) !== 0;
		this.hairColor = this.readBitsIntBe(3);
		this.alignToByte();
		this.eyeData = this.readU4le();
		this.eyebrowData = this.readU4le();
		this.noseData = this.readU2le();
		this.mouthData = this.readU2le();
		this.mouthData2 = this.readU2le();
		this.facialHairData = this.readU2le();
		this.glassesData = this.readU2le();
		this.moleData = this.readU2le();
		this.creatorName = Buffer.from(this.readBytes(20)).toString('utf16le');
		this.padding2 = this.readU2le();
		this.checksum = this.readU2le();

		// Carve out more specific data from the above values
		// TODO: read these bits directly instead of getting them later

		this.gender = (this.miiMetaData & 1);
		this.birthMonth = ((this.miiMetaData >> 1) & 15);
		this.birthDay = ((this.miiMetaData >> 5) & 31);
		this.favoriteColor = ((this.miiMetaData >> 10) & 15);
		this.favorite = ((this.miiMetaData >> 14) & 1);

		this.eyeType = (this.eyeData & 63);
		this.eyeColor = ((this.eyeData >> 6) & 7);
		this.eyeSize = ((this.eyeData >> 9) & 7);
		this.eyeStretch = ((this.eyeData >> 13) & 7);
		this.eyeRotation = ((this.eyeData >> 16) & 31);
		this.eyeHorizontal = ((this.eyeData >> 21) & 15);
		this.eyeVertical = ((this.eyeData >> 25) & 31);

		this.eyebrowType = (this.eyebrowData & 31);
		this.eyebrowColor = ((this.eyebrowData >> 5) & 7);
		this.eyebrowSize = ((this.eyebrowData >> 8) & 15);
		this.eyebrowStretch = ((this.eyebrowData >> 12) & 7);
		this.eyebrowRotation = ((this.eyebrowData >> 16) & 15);
		this.eyebrowHorizontal = ((this.eyebrowData >> 21) & 15);
		this.eyebrowVertical = ((this.eyebrowData >> 25) & 31);

		this.noseType = (this.noseData & 31);
		this.noseSize = ((this.noseData >> 5) & 15);
		this.noseVertical = ((this.noseData >> 9) & 31);


		this.mouthType = (this.mouthData & 63);
		this.mouthColor = ((this.mouthData >> 6) & 7);
		this.mouthSize = ((this.mouthData >> 9) & 15);
		this.mouthStretch = ((this.mouthData >> 13) & 7);

		this.mouthVertical = (this.mouthData2 & 31);
		this.facialHairMustache = ((this.mouthData2 >> 5) & 7);

		this.facialHairType = (this.facialHairData & 7);
		this.facialHairColor = ((this.facialHairData >> 3) & 7);
		this.facialHairSize = ((this.facialHairData >> 6) & 15);
		this.facialHairVertical = ((this.facialHairData >> 10) & 31);

		this.glassesType = (this.glassesData & 15);
		this.glassesColor = (this.glassesData >> 4) & 7;
		this.glassesSize = (this.glassesData >> 7) & 15;
		this.glassesVertical = (this.glassesData >> 11) & 15;

		this.moleEnable = (this.moleData >> 15);
		this.moleSize = ((this.moleData >> 1) & 15);
		this.moleHorizontal = ((this.moleData >> 5) & 31);
		this.moleVertical = ((this.moleData >> 10) & 31);
	}

	toStudioMii() {
		/*
			Can also disable randomization with:
			let miiStudioData = Buffer.alloc(0x2F);
			let next = 256;
			and removing "randomizer" and the "miiStudioData.writeUInt8(randomizer);" call
		*/
		const miiStudioData = Buffer.alloc(0x2F);
		const randomizer = Math.floor(256 * Math.random());
		let next = randomizer;
		let pos = 1;

		function encodeMiiPart(partValue) {
			const encoded = (7 + (partValue ^ next)) % 256;
			next = encoded;

			miiStudioData.writeUInt8(encoded, pos);
			pos++;
		}

		miiStudioData.writeUInt8(randomizer);

		if (this.facialHairColor === 0) {
			encodeMiiPart(8);
		} else {
			encodeMiiPart(this.facialHairColor);
		}

		encodeMiiPart(this.facialHairType);
		encodeMiiPart(this.build);
		encodeMiiPart(this.eyeStretch);
		encodeMiiPart(this.eyeColor + 8);
		encodeMiiPart(this.eyeRotation);
		encodeMiiPart(this.eyeSize);
		encodeMiiPart(this.eyeType);
		encodeMiiPart(this.eyeHorizontal);
		encodeMiiPart(this.eyeVertical);
		encodeMiiPart(this.eyebrowStretch);

		if (this.eyebrowColor === 0) {
			encodeMiiPart(8);
		} else {
			encodeMiiPart(this.eyebrowColor);
		}

		encodeMiiPart(this.eyebrowRotation);
		encodeMiiPart(this.eyebrowSize);
		encodeMiiPart(this.eyebrowType);
		encodeMiiPart(this.eyebrowHorizontal);
		encodeMiiPart(this.eyebrowVertical);
		encodeMiiPart(this.faceColor);
		encodeMiiPart(this.faceMakeup);
		encodeMiiPart(this.faceType);
		encodeMiiPart(this.faceWrinkles);
		encodeMiiPart(this.favoriteColor);
		encodeMiiPart(this.gender);

		if (this.glassesColor == 0) {
			encodeMiiPart(8);
		} else if (this.glassesColor < 6) {
			encodeMiiPart(this.glassesColor + 13);
		} else {
			encodeMiiPart(0);
		}

		encodeMiiPart(this.glassesSize);
		encodeMiiPart(this.glassesType);
		encodeMiiPart(this.glassesVertical);

		if (this.hairColor == 0) {
			encodeMiiPart(8);
		} else {
			encodeMiiPart(this.hairColor);
		}

		encodeMiiPart(this.hairFlip ? 1 : 0);
		encodeMiiPart(this.hairType);
		encodeMiiPart(this.height);
		encodeMiiPart(this.moleSize);
		encodeMiiPart(this.moleEnable);
		encodeMiiPart(this.moleHorizontal);
		encodeMiiPart(this.moleVertical);
		encodeMiiPart(this.mouthStretch);

		if (this.mouthColor < 4) {
			encodeMiiPart(this.mouthColor + 19);
		} else {
			encodeMiiPart(0);
		}

		encodeMiiPart(this.mouthSize);
		encodeMiiPart(this.mouthType);
		encodeMiiPart(this.mouthVertical);
		encodeMiiPart(this.facialHairSize);
		encodeMiiPart(this.facialHairMustache);
		encodeMiiPart(this.facialHairVertical);
		encodeMiiPart(this.noseSize);
		encodeMiiPart(this.noseType);
		encodeMiiPart(this.noseVertical);

		return miiStudioData;
	}
}

module.exports = Mii;
