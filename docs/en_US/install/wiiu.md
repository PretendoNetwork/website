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

Make sure to also check out [this](#switching-between-pretendo-network-and-nintendo-network) section to learn how to switch between Pretendo Network and Nintendo Network.

# RCE Patches
~~Unfortunately, some of Pretendo's supported games have major security and safety problems. While Nintendo fixed these
games on the 3DS, thus far they have neglected the Wii U. Pretendo has a patcher which attempts to fix these problems -
this is **essential** to play online safely, whether on Pretendo Network or Nintendo Network.~~

This is no longer true, as Nintendo has issued updates to all affected games fixing all known issues. These docs will remain up, however, in the event that any future bugs/exploits are found and require patches

<div class="tip">
⚠️ <b>Don't skip this step!</b>
</div>

To install the fix, navigate to the
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
The stable builds have been widely tested to ensure everything works as intended. Navigate to [Inkay's latest release](https://github.com/PretendoNetwork/Inkay/releases/latest) on GitHub and download the `Inkay-pretendo.wps` file from the latest release.

<img src="/assets/images/docs/install/wiiu/aroma/wps-highlight.png" width="100%">

Place the downloaded `Inkay-pretendo.wps` file on your SD card at `sd:/wiiu/environments/aroma/plugins`. It's normal for other Aroma plugins to be in this folder too.

<img src="/assets/images/docs/install/wiiu/aroma/sd-card.png" width="100%">

Place your SD card back into your console and boot like normal. If it worked, you'll see a notification of your connection:

<img src="/assets/images/docs/install/wiiu/aroma/working-notification.jpg" width="100%">

You are now connected to Pretendo Network and can continue with [PNID Setup](#pnid-setup).

## Bleeding Edge
Bleeding edge builds have not been widely tested, and do not guarantee any stability. Download the latest build from <a href="https://nightly.link/PretendoNetwork/Inkay/workflows/ci/main/inkay"  target="_blank">nightly</a>. Extract `inkay.zip` and place the extracted `Inkay-pretendo.wps` file on your SD card at `sd:/wiiu/environments/aroma/plugins`.

<img src="/assets/images/docs/install/wiiu/aroma/sd-card.png" width="100%">

Place your SD card back into your console and boot like normal. If it worked, you'll see a notification of your connection:

<img src="/assets/images/docs/install/wiiu/aroma/working-notification.jpg" width="100%">

You are now connected to Pretendo Network and can continue with [PNID Setup](#pnid-setup).

# PNID Setup

After installing Pretendo, you will need to create a PNID to use our services. There is currently two ways of creating a PNID, by creating an account with the website and linking it or creating it on your Wii U.

### PNID Setup - Website
You will want to register an account from [here](/account) and click `Don't have an account?` to register.

<img src="/assets/images/docs/install/wiiu/pnid/register-account-web.png" width="100%">

Right before registering a PNID, please make sure to save your password on some sort of note. This isn't necessary, but it prevents having to reset your password if you forget it. After registering just simply change your birth date, gender, timezone, country/region, etc to what you see fit. Once you have it set up we can switch back to the Wii U. Within your Wii U you will want to reconnect to Pretendo.

_**Note:** How you reconnect to Pretendo depends on how you installed it on your Wii U!_

Once you are reconnected, you will want to press the top left profile icon and press `Switch Account`, then press `Add New User`. Go through the user set up normally, but when it asks if you have an account, press `Yes` and put in your username and password. If it asks you to confirm your email afterwards, simply skip it. You will now be able to use Pretendo servers.

### PNID Setup - Wii U
Right before registering a PNID, please make sure to save your password on some sort of note. This isn't necessary, but it prevents having to reset your password if you forget it. You will want to go on you Wii U while Pretendo is still active and press the top left profile icon. After pressing the icon, press `Switch Account`, and then `Add New User`. Set up this account as normal, but once it asks if you have an account, press `No` and go through the account process normally. When it asks you again to link after adding a Mii, press `Link`. Choose your language and then accept the Pretendo Network Service Agreement.

<img src="/assets/images/docs/install/wiiu/pnid/pretendo-eula.jpg" width="100%">

Finally, set up your PNID, email and password. Once all of this is done, you will be able to use Pretendo servers.

# Switching between Pretendo Network and Nintendo Network

Occasionally, you may want to switch between your Pretendo Network and your Nintendo Network profiles on your Wii U; fortunately, it is super simple to switch between the two.

While connected to Pretendo, in the HOME Menu, switch to your Nintendo Network profile. If prompted for a password, do not provide it (if you don't have auto sign-in enabled, you may not have the option to not provide it). You are now inside your Nintendo Network profile.

On your Wii U GamePad, press the buttons `L + Down + SELECT`. This action opens up the Aroma plugin menu, which should look something like this:

<img src="/assets/images/docs/install/wiiu/pnid/aroma-plugins-list.jpg" width="100%">

You may have additional plugins in your menu. Navigate to the `Inkay` plugin and press `A` to enter it's settings.

You should now be greeted with a menu displaying two buttons. Click the one that says 'Patching'.

To use Nintendo's servers, set 'Connect to the Pretendo Network' to **false**. It should look something like this:

<img src="/assets/images/docs/install/wiiu/pnid/inkay-patching.jpg" width="100%">

Once you've done that, press the `B` button twice, then press the `HOME` button. Your console will reboot with Pretendo Network patches disabled. You can check this by verifying whether a message saying 'Using Nintendo Network' is displayed on boot.
<img src="/assets/images/docs/install/wiiu/pnid/nintendo-connection.jpg" width="100%">

After that, you should be able to access Nintendo Network. To go back to Pretendo, you can follow these steps again, this time signing into your Pretendo profile and ensuring that 'Connect to the Pretendo Network' is set to **true**.
