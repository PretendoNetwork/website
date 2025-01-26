# Wii U

You can connect your Wii U to Pretendo using one of 2 methods. Inkay is recommended unless you have some reason to avoid modding your console (e.g. you live in Japan where is is legally gray).

- [Inkay (homebrew - recommended)](#inkay)
- [SSSL (hackless)](#sssl)

# Inkay
**Pros:**
- All services supported
- Contains additional features and patches
- Works regardless of ISP
- Easy toggle on and off

**Cons:**
- Requires homebrew

## Installation
<div class="tip">
	ℹ️ This part of the guide assumes that you have a <b>Homebrewed System</b> using <b>Aroma</b>.
	If you don't yet, you can follow this <a href="https://wiiu.hacks.guide/" target="_blank">guide to set up homebrew on your Wii U</a>.
</div>

Locate the `Aroma Updater` icon on your Wii U Menu and open it.

<img src="/assets/images/docs/install/wiiu/aroma/aroma-updater-icon.jpg" alt="Screenshot of Wii U Menu with the Aroma Updater icon highlighted" width="100%">

On the welcome screen, press A to check for updates.

<img src="/assets/images/docs/install/wiiu/aroma/aroma-updater-welcome.png" alt="Screenshot of white text. 'Welcome to the Aroma updater' - 'A - Check for updates'" width="100%">

Wait for the update check to complete. Your screen may look slightly different to this image if newer updates have been released when you're reading this - that's okay.

<img src="/assets/images/docs/install/wiiu/aroma/aroma-updater-p1.png" alt="Aroma updater application displaying a list of payloads." width="100%">

Press R to move to Page 2.

<img src="/assets/images/docs/install/wiiu/aroma/aroma-updater-p2.png" alt="Aroma updater application displaying a list of additional plugins." width="100%">

Use the D-Pad to move the cursor down to Inkay, then press A to select it.

<img src="/assets/images/docs/install/wiiu/aroma/aroma-updater-inkay.png" alt="Aroma updater application displaying a list of additional plugins with Inkay highlighted and selected." width="100%">

Press + to begin the installation, then press A to confirm the changes. You may have additional updates listed in addition to Inkay - that's okay.

<img src="/assets/images/docs/install/wiiu/aroma/aroma-updater-confirm.png" alt="A confirmation dialog. Inkay will be updated or changed." width="100%">

<div class="tip">
	ℹ️ You may get a message stating "This version of this file is unknown!" in relation to Inkay - this means you have an old or beta version installed.
	You should press A to confirm replacing it with the correct version.
</div>

Wait for the installation to complete, then press A to restart your console.

<img src="/assets/images/docs/install/wiiu/aroma/aroma-updater-done.png" alt="A confirmation dialog. The console will now restart." width="100%">

Once the console restarts, you'll see a notification in the top-left informing you that Pretendo will be used. The notification disappears after a few moments.

<img src="/assets/images/docs/install/wiiu/aroma/pretendo-notification.jpg" alt="The Wii U user selection screen, with 'Using Pretendo Network' overlaid in the top-left" width="100%">

Inkay is now installed and working. You can proceed to [PNID Setup](#pnid-setup) to create an account.

# SSSL
**Pros:**
- Does not require homebrew
- Very easy to setup

**Cons:**
- Only a subset of services are supported
- Lacks additional features and patches
- Does not work on some ISPs
- Hard to switch on or off

SSSL is a (limited) hackless method of accessing most services by exploiting a bug in the Wii U's SSL module. All Nintendo Network games produced by Nintendo are supported by SSSL, as are the ***in-game*** Miiverse features. The main Miiverse app, in-game ***posting*** app, and any game which uses its own SSL stack (YouTube, WATCH_DOGS, etc.), are ***NOT*** supported by this method, as they are unaffected by the SSL exploit.

## Installation
<div class="tip">
	ℹ️ System Settings, and therefore SSSL, requires a Wii U GamePad to use on unmodified systems.
</div>

Locate the `System Settings` icon on your Wii U Menu and open it.

<img src="/assets/images/docs/install/wiiu/sssl/system-settings.jpg" alt="The Wii U Menu, with the System Settings icon highlighted" width="100%">

Open the Internet category.

<img src="/assets/images/docs/install/wiiu/sssl/internet-settings.jpg" alt="The System Settings app, with the Internet category highlighted" width="100%">

Select `Connect to the Internet`.

<img src="/assets/images/docs/install/wiiu/sssl/internet-settings-connect.jpg" alt="The System Settings app, with the Connect to the Internet button highlighted" width="100%">

Select `Connection List` in the top-right.

<img src="/assets/images/docs/install/wiiu/sssl/internet-settings-scan.jpg" alt="The Internet Connection Setup panel. In the top-right is a Connection List button (X)" width="100%">

Locate the connection with a "Wii U" logo. This is the one your system will use by default. Press A to edit it.

<img src="/assets/images/docs/install/wiiu/sssl/internet-connection-list.jpg" alt="A list of internet connections. 'Wired Connection' is marked with a Wii U and Wii logo, and is highlighted." width="100%">

Select `Change Settings`.

<img src="/assets/images/docs/install/wiiu/sssl/internet-connection-change.jpg" alt="A list of options. 'Change Settings' is highlighted." width="100%">

Navigate to the right and down to the `DNS` button, and press A to edit.

<img src="/assets/images/docs/install/wiiu/sssl/internet-connection-dns-button.jpg" alt="The second page of the Wii U connection editor. DNS is highlighted." width="100%">

Select `Do not auto-obtain`. We will provide our own DNS for SSSL to work.

<img src="/assets/images/docs/install/wiiu/sssl/internet-connection-dns-obtain.jpg" alt="Two options for 'Automatically obtain DNS?' 'Do not auto-obtain' is highlighted." width="100%">

This brings up the DNS input. We will change both the Primary and Secondary DNS settings.

<img src="/assets/images/docs/install/wiiu/sssl/internet-connection-dns-editor.jpg" alt="Two input fields for Primary and Secondary DNS." width="100%">

For the Primary DNS, enter `88.198.140.154`. This is the SSSL server.

<img src="/assets/images/docs/install/wiiu/sssl/internet-connection-dns-primary.jpg" alt="'Enter the primary DNS' field, with 88.198.140.154 - the SSSL server - input." width="100%">

For the Secondary DNS, enter `9.9.9.9` (or another public DNS of your choice). This will serve as a fallback if Pretendo's SSSL server should go offline, allowing your console to still access the Internet. If Pretendo is offline and the fallback is used, however, the console will access Nintendo Network rather than Pretendo Network. If this is undesirable to you, leave this field blank.

<img src="/assets/images/docs/install/wiiu/sssl/internet-connection-dns-secondary.jpg" alt="'Enter the secondary DNS' field, with 9.9.9.9 - a public DNS server - input." width="100%">

Review the final settings and ensure you typed them correctly. The Wii U will add leading zeroes to each number - this is okay. If they are correct, press Confirm.

<img src="/assets/images/docs/install/wiiu/sssl/internet-connection-dns-done.jpg" width="100%">

Press B to save the connection. You may perform a connection test and set the connection as default. Then, press B until System Settings exits.

SSSL is now installed and working. You can proceed to [PNID Setup](#pnid-setup) to create an account.

To disconnect from Pretendo Network (e.g. to access the Nintendo eShop) repeat this process, but select `Auto-obtain` for the DNS.

# PNID Setup
After installing Pretendo, you must register a Pretendo Network ID (PNID). There is currently two ways of creating a PNID: Creating an account with the website and linking it, or creating it on your Wii U.

<div class="tip red">
	<strong>CAUTION:</strong>
	A Pretendo Network ID may not use the same username as an account already linked to your Wii U! If you have any existing Nintendo Network IDs on your Wii U which share the username you wish to use, those accounts MUST be removed from your console first.
</div>

### Website
You will want to register an account from [here](/account) and click `Don't have an account?` to register.

<div class="tip yellow">
	<strong>NOTE:</strong>
	Account settings cannot be modified at this time. Feature updates to the website have been paused as we migrate the codebase, and the account settings app on the Wii U requires additional patches.
</div>

<img src="/assets/images/docs/install/wiiu/pnid/register-account-web.png" alt="Screenshot of a web form to register an account" width="100%">

Once your account is registered, link it to your console as you would a Nintendo Network ID.

Your PNID is now set up and ready to use. You may continue reading to learn about optional extras, like Inkay's features and transferring save data, or you can stop here.

### Wii U
Create the Pretendo Network ID as you would a Nintendo Network ID.

# Using Inkay
If you're using Inkay rather than SSSL, there are some additional features you may find helpful.

<details>
<summary>Using Nintendo Network</summary>
You might need to switch back to Nintendo Network to access the Nintendo eShop or other services.

Press `L + Down + SELECT` on the Wii U GamePad to open the Aroma plugin menu. Use the D-pad to highlight Inkay then press A to select.

<img src="/assets/images/docs/install/wiiu/inkay-tips/aroma-plugin-menu.png" alt="Screenshot of Aroma plugin menu with Inkay entry highlighted" width="100%">

Press A to enter the `Network Selection` area.

<img src="/assets/images/docs/install/wiiu/inkay-tips/inkay-network-selection.png" alt="Screenshot of Inkay menu with Network Selection highlighted" width="100%">

Press A on `Connect to Pretendo network` to toggle it to `false`.

<img src="/assets/images/docs/install/wiiu/inkay-tips/inkay-network-false.png" alt="Screenshot of Inkay menu with Connect to Pretendo Network set to false" width="100%">

Press `B` three times to exit the Aroma plugin menu. Your console will restart. Once it does, a notification will appear showing that you are now using Nintendo Network.

<img src="/assets/images/docs/install/wiiu/inkay-tips/nintendo-notification.jpg" alt="The Wii U user selection screen, with 'Using Nintendo Network' overlaid in the top-left" width="100%">

You may now use your NNID to access the eShop or other Nintendo services. To return to Pretendo Network, repeat the process and set `Connect to Pretendo network` to `true`.
</details>

<details>
<summary>Resetting WaraWara Plaza</summary>
If you're having issues with WaraWara Plaza (where the Miis run around on the TV), resetting it can help.

Exit any games or software such that you're on the Wii U Menu, then press `L + Down + SELECT` on the Wii U GamePad to open the Aroma plugin menu. Use the D-pad to highlight Inkay then press A to select.

<img src="/assets/images/docs/install/wiiu/inkay-tips/aroma-plugin-menu.png" alt="Screenshot of Aroma plugin menu with Inkay entry highlighted" width="100%">

Use the D-pad to select `Other Settings` and press A to enter it.

<img src="/assets/images/docs/install/wiiu/inkay-tips/inkay-other-settings.png" alt="Screenshot of Inkay menu with Other Settings highlighted" width="100%">

Press A on `Reset Wara Wara Plaza` to perform the reset.

<img src="/assets/images/docs/install/wiiu/inkay-tips/inkay-wwp-reset.png" alt="Screenshot of Inkay menu with Reset Wara Wara Plaza highlighted" width="100%">

The button will change to indicate the console must be restarted.

<img src="/assets/images/docs/install/wiiu/inkay-tips/inkay-wwp-apply.png" alt="Screenshot of Inkay menu with Reset Wara Wara Plaza highlighted. The entry now says 'Restart to apply'" width="100%">

Press `B` three times to exit the Aroma plugin menu. Your console will restart. Once it does, the process is complete.
</details>

# Transferring save data to your Pretendo Network account

Pretendo Network is not compatible with existing Nintendo Network IDs. This means you must create a new account. Because of this, you may want to move existing game save data to your new account. This is optional.

<div class="tip red">
	<strong>Note:</strong>
	This only works with local save data. Any user data stored on Nintendo's servers cannot be transferred to any other accounts.
</div>

To move your save data, you will need a save data backup homebrew application. This guide will use the WUT port of SaveMii for Aroma.  To begin, download the latest [GitHub release](https://github.com/Xpl0itU/savemii/releases) of SaveMii or download it from the [Homebrew App Store](https://hb-app.store).

<img src="/assets/images/docs/install/wiiu/savedatabackup/savemii-appstore.jpg" alt="Screenshot of Homebrew App Store page of SaveMii Mod" width="100%">

Once installed, open the application from the HOME Menu. You should see a menu for Wii U and vWii saves.

<img src="/assets/images/docs/install/wiiu/savedatabackup/savemii-mainmenu.jpg" alt="SaveMii menu" width="100%">

Select `Wii U Save Management`. You should now see a list of installed games. Find and select the game you would like to transfer the save data of.

Select `Backup savedata`.

<img src="/assets/images/docs/install/wiiu/savedatabackup/savemii-backup.jpg" alt="SaveMii backup save data menu" width="100%">

Select a new slot to backup the save data to. If you select a non-empty slot, the backup data in that slot will be overwritten.

Select the profile to backup the save data from. This should be your ***Nintendo*** Network ID.

Optionally you may select to backup "common" save data. This save data should be shared by all users, and is not required to be backed up. Though you may still do so if you choose.

Press the `A` button when ready to backup your save data.

Once the backup has completed, press the `B` button to return to the games menu. Select `Restore savedata`.

<div class="tip red">
	<strong>CAUTION:</strong>
	Restoring a save backup will overwrite the existing save data for the game for the selected user(s). Proceed with caution.
</div>

Select the backup slot you just backed the save data up to.

Select the profile to restore the save data to. This should be your ***Pretendo*** Network ID.

<img src="/assets/images/docs/install/wiiu/savedatabackup/savemii-transfer.jpg" alt="SaveMii restore save data menu" width="100%">

When ready, press the `A` button to transfer your data. Press `A` again to confirm your actions. If you get a message about backing up your data on your Pretendo profile, ignore. Your screen may briefly flash as the data is copied over.

Once completed, exit SaveMii and ensure the game you transferred works properly on your Pretendo profile.

<img src="/assets/images/docs/install/wiiu/savedatabackup/savemii-saveworkingonpretendo.jpg" alt="Screenshot of a game that loaded successfully" width="100%">

Repeat this process for any other save data you'd like to transfer to your Pretendo profile.
