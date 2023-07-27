# Wii U

<div class="tip">
	ℹ️ This guide assumes that you have a <b>Homebrewed System</b> using <b>Aroma</b>.
	You can follow this <a href="https://wiiu.hacks.guide/" target="_blank">guide</a> on how to homebrew your system first, then install
	Aroma using <a href="https://wiiu.hacks.guide/#/aroma/getting-started" target="_blank">this guide</a>.
</div>

You can get a Wii U onto Pretendo in just 3 steps:
1. [RCE Patches](#rce-patches)
2. [Connecting to Pretendo](#connecting-to-pretendo)
3. [PNID Setup](#pnid-setup)

# RCE Patches
Unfortunately, some of Pretendo's supported games have major security and safety problems. While Nintendo fixed these
games on the 3DS, thus far they have neglected the Wii U. Pretendo has a patcher which attempts to fix these problems -
this is **essential** to play online safely, whether on Pretendo Network or Nintendo Network.

<div class="tip">
⚠️ <b>Don't skip this step!</b>
</div>

To install the fix, naviagate to the
[latest release of the RCE patcher](https://github.com/PretendoNetwork/rce_patches/releases/latest) on GitHub and
download the `rce_patches.wps` file.

<img src="/assets/images/docs/install/wiiu/aroma/rce-wps-highlight.png" width="100%">

Place the downloaded `rce_patches.wps` file on your SD card at `sd:/wiiu/environments/aroma/plugins`. It's normal for other Aroma plugins to be in this folder too.

<img src="/assets/images/docs/install/wiiu/aroma/rce-sd-card.png" width="100%">

Place your SD card back into your console and boot like normal.

# Connecting to Pretendo

<div class="tip">
    ℹ️ Already have Pretendo installed? Skip ahead to <a href="#pnid-setup">PNID Setup</a>!
</div>

To connect to Pretendo Network you must use the [Inkay](https://github.com/PretendoNetwork/Inkay) plugin with Aroma. 
The stable version is recommended for most users, however betatesters and others may be interested in the bleeding edge version.

## Stable
Navigate to [Inkay's latest release](https://github.com/PretendoNetwork/Inkay/releases/latest) on GitHub and download the `Inkay-pretendo.wps` file from the latest release.

<img src="/assets/images/docs/install/wiiu/aroma/wps-highlight.png" width="100%">

Place the downloaded `Inkay-pretendo.wps` file on your SD card at `sd:/wiiu/environments/aroma/plugins`. It's normal for other Aroma plugins to be in this folder too.

<img src="/assets/images/docs/install/wiiu/aroma/sd-card.png" width="100%">

Place your SD card back into your console and boot like normal. If it worked, you'll see a notification of your connection:

<img src="/assets/images/docs/install/wiiu/aroma/working-notification.jpg" width="100%">

You are now connected to Pretendo Network and can continue with [PNID Setup](#pnid-setup).

## Bleeding Edge
Navigate to the [actions](https://github.com/PretendoNetwork/Inkay/actions) page on the Aroma GitHub repository.

<img src="/assets/images/docs/install/wiiu/aroma/actions-highlight.png" width="100%">

Select the `Inkay-CI` workflow and select the latest workflow run. _**Note:** At this stage you may also use the provided filters to only grab builds from specific branches, events, etc. By default the latest build, regardless of branch, is always shown._

<img src="/assets/images/docs/install/wiiu/aroma/workflow-highlight.png" width="100%">

Select the `inkay` artifact. This will download a `inkay.zip` zip file.

<img src="/assets/images/docs/install/wiiu/aroma/artifact-highlight.png" width="100%">

Extract `inkay.zip` and place the extracted `Inkay-pretendo.wps` file on your SD card at `sd:/wiiu/environments/aroma/plugins`.

<img src="/assets/images/docs/install/wiiu/aroma/sd-card.png" width="100%">

Place your SD card back into your console and boot like normal. If it worked, you'll see a notification of your connection:

<img src="/assets/images/docs/install/wiiu/aroma/working-notification.jpg" width="100%">

You are now connected to Pretendo Network and can continue with [PNID Setup](#pnid-setup).

# PNID Setup

After installing Pretendo, you will need to create a PNID to use our services. There is currently two ways of creating a PNID, by creating an account with the website and linking it or creating it on your Wii U.

### PNID Setup - Website
You will want to register an account from [here](/account) and click `Don't have an account?` to register.

<img src="/assets/images/docs/install/wiiu/pnid/register-account-web.png" width="100%">

Right before registering a PNID, please make sure to save your password on some sort of note, as you will not be able to reset your password. After registering just simply change your birth date, gender, timezone, country/region, etc to what you see fit. Once you have it set up we can switch back to the Wii U. Within your Wii U you will want to reconnect to Pretendo _**Note:** how you reconnect to Pretendo depends on how you installed it on your Wii U!_ Once you are reconnected, you will want to press the top left profile icon and press `Switch Account`, then press `Add New User`. Go through the user set up normally, but when it asks if you have an account, press `Yes` and put in your username and password. If it asks you to confirm your email afterwards, simply skip it. You will now be able to use Pretendo Servers

### PNID Setup - Wii U
Right before registering a PNID, please make sure to save your password on some sort of note, as you will not be able to reset your password. You will want to go on you Wii U while Pretendo is still active and press the top left profile icon. After pressing the icon, press `Switch Account`, and then `Add New User`. Set up this account as normal, but once it asks if you have an account, press `No` and go through the account process normally. When it asks you again to you want to link after adding a mii, press `Link`. Choose your language and then accept the Pretendo Network Service Agreement.

<img src="/assets/images/docs/install/wiiu/pnid/pretendo-eula.jpg" width="100%">

Finally, set up your pnid, email and password. Once all of this is done you will be able to use Pretendo Server
