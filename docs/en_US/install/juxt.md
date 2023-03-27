# Installing the Juxtaposition applet

<div class="tip">
	ℹ️ This guide assumes that you have a real console running homebrew. If you don't, please first follow <a href="https://wiiu.hacks.guide/" target="_blank">this guide for Wii U</a> or <a href="https://3ds.hacks.guide/" target="_blank">this guide for a 3DS/2DS family system</a> on how to homebrew your system.
</div>

Some games come with Miiverse support. Juxtaposition, or Juxt for short, is our Miiverse reimagining.

You'll get the best experience on Juxtaposition with a Pretendo Network ID, including in-game patches. You can figure out how to install the rest of Pretendo Network by heading [here for Wii U](/docs/install/wiiu) or [here for a 3DS/2DS family system](/docs/install/3ds).

You can still access Juxtaposition using a Nintendo Network ID, although note that when doing so, you will be in Guest Mode, which limits you from Yeahing posts or making posts of your own.

## Select your console
- ### [Wii U](#wii-u-1)
- ### [3DS/2DS Family](#3ds-1)

# Wii U

<div class="tip">
	⚠️ At this time, the modfications made to your Miiverse applet by Juxtaposition cannot be reverted.
</div>

If you use Tiramisu, and followed our main guide, then you do not have `50_hbl_launcher.rpx` on your SD card. This is the time where you will want to re-add it.

Download the ZIP file by clicking [here](https://github.com/wiiu-env/HBLInstallerWrapper/releases/download/v0.1/HBLInstallerWrapper_20220905-095513.zip). Extract it, and then copy `50_hbl_launcher.rpx` to `sd:/wiiu/environments/tiramisu/modules/setup/`.

<img src="/assets/images/docs/install/wiiu/tiramisu/sd-card-hbl.png" width=100% height=auto/>

Download the Juxtaposition patcher by clicking [here](https://github.com/PretendoNetwork/Martini/releases/download/v0.3/martini-juxt-patcher.rpx). Copy `martini-juxt-patcher.rpx` and place it on your SD card at `sd:/wiiu/apps/`.

<img src="/assets/images/docs/install/wiiu/juxt/martini-sd-card.png" width=100% height=auto/>

Place your SD card back into your console and boot like normal.

If you use Tiramisu, open Mii Maker to get to the Homebrew Launcher.

Launch `martini-juxt-patcher.rpx`.

<img src="/assets/images/docs/install/wiiu/juxt/martini-hbl.png" width=100% height=auto/>

After confirming the state of the Miiverse applet, press A to apply the patches.

<img src="/assets/images/docs/install/wiiu/juxt/martini-install.png" width=100% height=auto/>

Once the patcher is done running and your console has rebooted, you're done! The Juxtaposition applet has now been installed.

<img src="/assets/images/docs/install/wiiu/juxt/martini-success.png" width=100% height=auto/>

If you're on Tiramisu and you'd like to access Mii Maker again, remove `50_hbl_launcher.rpx` from `sd:/wiiu/environments/tiramisu/modules/setup/`.

Have fun!

# 3DS

First, download `Juxt.zip` from [here](https://cdn.discordapp.com/attachments/911878047895023637/937516295069515866/Juxt.zip).

Extract `Juxt.zip`, and copy the `3ds` and `luma` folders to the root of your SD card. You should now have the `000400300000BC02`, `000400300000BD02`, and `000400300000BE02` Luma patches, along with the `juxt.pem` cert.

<img src="/assets/images/docs/install/3ds/sd-card-juxt-luma.png" width=100% height=auto/>
<img src="/assets/images/docs/install/3ds/sd-card-juxt-3ds.png" width=100% height=auto/>

Place your SD card back into your console.

Turn on your console and hold (Select) *at the same time* to load the Luma3DS configuration menu. Make sure that game patches are enabled; if they're not, select it before pressing (Start) to exit to the home menu.

The Juxtaposition applet has now been set up! Have fun!

---

Welcome to Pretendo Network!

If you encounter (or have encountered) any errors, try [searching](/docs/search) for the error code. If that doesn't work, join our [Discord](https://invite.gg/pretendo), and either ask the #support channel for help or get in touch with a developer.