<div class="tip red">
	<strong>Note!</strong>
	<br>
	Pretendo Network is currently in closed beta! The servers are only accessible to testers. To become a tester, upgrade your <a href="/account/upgrade" target="_blank">PNID here</a>
</div>

<div class="tip green">This Guide may be missing some info or incomplete.</div>

# 3DS/2DS Family

In this guide you will learn how to setup a PNID from Scratch on a 3DS.

<div class="tip">
	ℹ️ This guide assumes that you have a <b>Homebrewed System</b>, if you don't please follow this <a href="https://3ds.hacks.guide/" target="_blank">guide</a> on how to homebrew your system first.
</div>

## Download
Nimbus [Github](https://github.com/PretendoNetwork/nimbus/releases)


## Usage
1. Extract to the root of your SD card
2. Ensure Game Patching is enabled in Luma (hold SELECT at boot to enter Luma settings)
3. Run the Nimbus homebrew and select the network you wish to use (Nintendo Network, or Pretendo Network)

## How does it work?
Nimbus will create a 2nd local account set to the `test` NASC environment. The IPS patches will set the `test` NASC environment URLs to point to Pretendo. You may freely switch between Pretendo and Nintendo. Your selected mode will persist between reboots.

## 2nd local account?
You may have thought to yourself; _"2nd local account? What's that? I thought the 3DS only had one account?"_ And you'd be half right. The 3DS only _normally_ supports one account, and you may only have one account active at a time. However Nintendo implemented support for multiple local accounts on the 3DS/2DS which remains unused on all retail units. On a normal retail unit only one local account is ever made, which is set to the `prod` NASC environment. Local accounts may be set to `prod`, `test` or `dev`. Nimbus makes use of this unused feature to create sandboxed local accounts with different environments

## Can I connect my PNID?
Currently connecting a PNID is not officially supported, though some users have reported it working just fine.