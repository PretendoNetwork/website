# 3DS/2DS Family

<div class="tip">
	ℹ️ This guide assumes that you have a <b>Homebrewed System</b>, if you don't please follow this <a href="https://3ds.hacks.guide/" target="_blank">guide</a> on how to homebrew your system first.
</div>

To connect to Pretendo Network using a 3DS/2DS system you must use the Nimbus homebrew and Luma patches

Navigate to the [releases](https://github.com/PretendoNetwork/Nimbus) page on the Nimbus GitHub repository

<img src="/assets/images/docs/install/3ds/releases-highlight.png" width=100% height=auto/>

Now download the `nimbus.zip` file from the latest release

<img src="/assets/images/docs/install/3ds/zip-highlight.png" width=100% height=auto/>

Extract `nimbus.zip` and copy the `3ds` and `luma` folders to the root of your SD card. You should now have the `0004013000002F02`, `0004013000003202`, and `0004013000003802` Luma patches along with the `nimbus.3dsx` homebrew

<img src="/assets/images/docs/install/3ds/sd-card-luma.png" width=100% height=auto/>
<img src="/assets/images/docs/install/3ds/sd-card-3ds.png" width=100% height=auto/>

Place your SD card back into your console. Boot your console and ensure Luma patches are enabled. Run the Nimbus homebrew and select the network you wish to use (Nintendo Network, or Pretendo Network)

## Luma patches
We make use of 3 Luma patches to connect your console to Pretendo:

1) `0004013000002F02` - SSL system module. This patch disables SSL verification, allowing your console to establish an SSL connection with our servers
2) `0004013000003202` - Friends system module. This patch replaces the `https://nasc.nintendowifi.net` URL with our servers URL 
3) `0004013000003802` - act system module. This patch replaces the `https://account.nintendo.net/v1/api/` URL with our servers URL

## How does it work?
Nimbus will create a 2nd local account set to the `test` NASC environment. The IPS patches will set the `test` NASC environment URLs to point to Pretendo. You may freely switch between Pretendo and Nintendo. Your selected mode will persist between reboots.

## 2nd local account?
You may have thought to yourself; _"2nd local account? What's that? I thought the 3DS only had one account?"_ And you'd be half right. The 3DS only _normally_ supports one account, and you may only have one account active at a time. However Nintendo implemented support for multiple local accounts on the 3DS/2DS which remains unused on all retail units. On a normal retail unit only one local account is ever made, which is set to the `prod` NASC environment. Local accounts may be set to `prod`, `test` or `dev`. Nimbus makes use of this unused feature to create sandboxed local accounts with different environments