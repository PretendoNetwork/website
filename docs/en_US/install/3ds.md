# 3DS/2DS Family

<div class="tip">
	ℹ️ This guide assumes that you have a <b>Homebrewed System running the latest version of Luma3DS</b>, if you don't please follow this <a href="https://3ds.hacks.guide/" target="_blank">guide</a> on how to homebrew your system first.
</div>

The following steps are required for you to connect to the Pretendo Network:
1. [Downloading Nimbus](#downloading-nimbus)
2. [Enabling Luma patches](#luma-patches)
3. [Using Nimbus](#using-nimbus)

## Downloading Nimbus

Before you start, power off your console and insert its SD card into your computer.

Once inserted, download the latest [Nimbus release](https://github.com/PretendoNetwork/Nimbus/releases/latest).

Nimbus is available as both a 3DSX app and an installable CIA. The releases page offers downloads for both. Select the version you would like to use, or select the `combined.[version].zip` archive to use both.

<img src="/assets/images/docs/install/3ds/zip-highlight.png" width=100% height=auto/>

Extract the contents of the zip archive to the root of your SD card. If you are asked to merge or overwrite files, accept the changes.

You should now have the `0004013000002F02`, `0004013000003202`, and `0004013000003802` Luma patches along with the `nimbus.3dsx` and `nimbus.cia` homebrew.

<img src="/assets/images/docs/install/3ds/sd-card-luma.png" width=100% height=auto/>
<img src="/assets/images/docs/install/3ds/sd-card-3ds.png" width=100% height=auto/>

Place your SD card back into your console.

## Luma patches

<div class="tip">
ℹ️ <b>Skip this step if you've already enabled the required patches on your console for Pretendo Network.</b>
</div>

In order to make use of the Pretendo Network service, you will need to enable Luma patches on your console. Hold the `SELECT` button on your 3DS and power it on.

On the screen that is displayed, make sure that these following options are enabled:

* `Enable loading external FIRMS and modules`
* `Enable game patching`

Press `START` to save and continue with these changes.

## Installing Nimbus to HOME Menu

<div class="tip">
ℹ️ <b>Skip this step if you downloaded the 3dsx only zip file.</b>
</div>

If you downloaded the combined or cia archives, you can install Nimbus to the HOME Menu for quick and easy access.

Open FBI. If you do not have FBI, download the latest release from [GitHub](https://github.com/Steveice10/FBI/releases/latest). Select `SD`, then `cias`. Find and select `nimbus.cia`. Select either `Install CIA` or `Install and delete CIA`.

Once it has finished installing, press the HOME button and exit FBI. You should see a message that a new application has been added to the HOME Menu. Click OK and you'll now have Nimbus on your HOME Menu.

## Using Nimbus

Depending on how you installed Nimbus, launch it either through the Homebrew Launcher or the 3DS HOME Menu. Select either `Pretendo` or `Nintendo` to swap between services.

Your selection persists between reboots.

## Signing into your PNID

To fully enjoy Pretendo Network, you'll need to sign into your PNID. It's not required for most things, but it's worth doing in case you need it in the future. If you haven't already, please [create a Pretendo account](/account) on your computer or phone before following the rest of the guide.

On your 3DS, open up System Settings and tap on Nintendo Network ID Settings. It'll take a while to load, but once you do, follow along until the part where you get asked whether you want to link your account. Select `Yes` and use the credentials you used to create your Pretendo account. Once you've done that, continue normally and you should be all set up.

Congratulations! You can now use Pretendo Network and enjoy 3DS games online even after April 2024.

## Other information

### How does Nimbus work?
Nimbus will create a 2nd local account set to the `test` NASC environment. The IPS patches will set the `test` NASC environment URLs to point to Pretendo. You may freely switch between Pretendo and Nintendo. Your selected mode will persist between reboots.

### 2nd local account?
You may have thought to yourself; _"2nd local account? What's that? I thought the 3DS only had one account?"_ And you'd be half right. The 3DS only _normally_ supports one account, and you may only have one account active at a time. However Nintendo implemented support for multiple local accounts on the 3DS/2DS which remains unused on all retail units. On a normal retail unit only one local account is ever made, which is set to the `prod` NASC environment. Local accounts may be set to `prod`, `test` or `dev`. Nimbus makes use of this unused feature to create sandboxed local accounts with different environments
