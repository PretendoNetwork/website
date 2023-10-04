# 3DS/2DS Family

<div class="tip">
	ℹ️ This guide assumes that you have a <b>Homebrewed System running the latest version of the Luma3DS custom firmware</b>, if you don't please follow this <a href="https://3ds.hacks.guide/" target="_blank">guide</a> on how to homebrew your system first.
</div>

You can get a 3DS onto Pretendo Network in 5 easy steps:
1. [Downloading Nimbus](#downloading-nimbus-to-your-sd-card)
2. [Enabling Luma patches](#luma-patches)
3. [Installing Nimbus to HOME Menu](#installing-nimbus-app-to-home-menu)
4. [Using Nimbus](#using-nimbus)
5. [Signing into Pretendo](#signing-into-your-pnid)

## Downloading Nimbus to your SD card

Before you start, make sure your 3DS is turned off, and insert the SD card that you use for your Nintendo 3DS into your computer.

Once you've done that, navigate to the [releases](https://github.com/PretendoNetwork/Nimbus) page on the Nimbus GitHub repository.

<img src="https://github.com/PretendoNetwork/website/assets/56035537/4509c4a6-5b30-42d2-a5e6-182178bde980" width=100% height=auto/>

There's a few different ways to use Nimbus, but for the best experience, download the `combined.[version].zip` file onto your computer. This file allows you to launch Nimbus both from your HOME Menu and the Homebrew Launcher. The other two files only do one or the other.

<img src="https://github.com/PretendoNetwork/website/assets/56035537/b92c7e77-6394-431d-b0b7-4ee6e4c58c65" width=100% height=auto/>

Extract the contents of the zip file you just downloaded and copy all of the contents of the zip file to the root of your SD card. If your computer asks you, merge files.

You should now have the `0004013000002F02`, `0004013000003202`, and `0004013000003802` Luma patches along with the `nimbus.3dsx` and `nimbus.cia` homebrew.

<img src="/assets/images/docs/install/3ds/sd-card-luma.png" width=100% height=auto/>
<img src="/assets/images/docs/install/3ds/sd-card-3ds.png" width=100% height=auto/>

Place your SD card back into your console.

## Luma patches
We make use of 3 Luma patches to connect your console to Pretendo:

1) `0004013000002F02` - SSL system module. This patch disables SSL verification, allowing your console to establish an SSL connection with our servers
2) `0004013000003202` - Friends system module. This patch replaces the `https://nasc.nintendowifi.net` URL with our servers URL 
3) `0004013000003802` - act system module. This patch replaces the `https://account.nintendo.net/v1/api/` URL with our servers URL

<div class="tip">
ℹ️ <b>Skip this step if Luma patches are already enabled on your console.</b>
</div>

In order to make use of the patches listed above, you will need to enable Luma patches on your console. Hold the SELECT button on your 3DS and power it on.

You should be greeted to a black screen with a few tickboxes. You'll need to tick 'enable loading external FIRMS and modules' and 'enable game patching' to ensure Pretendo works correctly. After that, press START on your console to save and boot into your 3DS.

## Installing Nimbus app to HOME Menu

<div class="tip">
ℹ️ <b>Skip this step if you downloaded the 3dsx only zip file.</b>
</div>

If you downloaded the combined or cia zip files, you can install the Nimbus application to the HOME Menu for quick and easy access. Here's how to do that.

First of all, open up the FBI application on your 3DS HOME Menu. Once it is loaded, click on SD and then click on cias. Next, locate `nimbus.cia` and click on it. In the menu that appears, press the install and delete CIA button. This installs the application to your HOME Menu.

Once it has finished installing, press the HOME button and exit FBI. You should see a message that a new application has been added to the HOME Menu. Click OK and you'll now have Nimbus on your HOME Menu for easy access.

## Using Nimbus

To use Pretendo servers instead on Nintendo's servers, you'll need to open up Nimbus. If you followed the previous step, you can find it on your HOME Menu, or you can also find it in the Homebrew Launcher. Once inside Nimbus, click on Pretendo to switch to your Pretendo profile.

You can also repeat the same steps to go back to the Nintendo profile if you want to use Nintendo's servers.

Your active profile persists between reboots, so there's no need to open up Nimbus to switch to Pretendo (or to Nintendo) every time you turn on your 3DS.

## Signing into your PNID

Once inside the Pretendo profile, you'll need to sign into your Pretendo Network ID to fully enjoy Pretendo. If you haven't already, [create a Pretendo account](/account) on your computer or phone.

On your 3DS, open up System Settings and tap on Nintendo Network ID Settings. It'll take a while to load, but once you do, follow along until the part where you get asked whether you want to link your account. Select `Yes` and use the credentials you used to create your Pretendo account. Once you've done that, continue normally and you should be all set up.

Congratulations! You can now use Pretendo Network and enjoy 3DS games online even after April 2024.

## Other information

### How does Nimbus work?
Nimbus will create a 2nd local account set to the `test` NASC environment. The IPS patches will set the `test` NASC environment URLs to point to Pretendo. You may freely switch between Pretendo and Nintendo. Your selected mode will persist between reboots.

### 2nd local account?
You may have thought to yourself; _"2nd local account? What's that? I thought the 3DS only had one account?"_ And you'd be half right. The 3DS only _normally_ supports one account, and you may only have one account active at a time. However Nintendo implemented support for multiple local accounts on the 3DS/2DS which remains unused on all retail units. On a normal retail unit only one local account is ever made, which is set to the `prod` NASC environment. Local accounts may be set to `prod`, `test` or `dev`. Nimbus makes use of this unused feature to create sandboxed local accounts with different environments
