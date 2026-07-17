# 3DS/2DS Family

<div class="tip red">
	<strong>CAUTION:</strong>
	SYSTEM TRANSFERS ARE NOT CURRENTLY SUPPORTED BY OUR SERVERS. ATTEMPTING TO PERFORM A SYSTEM TRANSFER MAY PREVENT YOU FROM BEING ABLE TO GO ONLINE IN THE FUTURE. SUPPORT FOR SYSTEM TRANSFERS IS IN DEVELOPMENT.
</div>

<div class="tip">
	ℹ️ This guide assumes that you have a <b>Homebrewed System running the latest version of Luma3DS (v13 or higher)</b>. If you don't, please follow this <a href="https://3ds.hacks.guide/" target="_blank">guide</a> on how to install homebrew to your system first.
</div>

The following steps are required for you to connect to the Pretendo Network:

1. [Downloading Nimbus](#downloading-nimbus)
2. [Enabling Luma patches](#enabling-luma-patches)
3. [Using Nimbus](#using-nimbus)
4. [Link a Pretendo Network ID (optional)](#link-a-pretendo-network-id-optional)
5. [Other information](#other-information)

## Downloading Nimbus

### Using Universal Updater

The easiest way to get Nimbus is by using Universal Updater. Universal Updater is also great for updating all of your other homebrew apps, so installing it is highly recommended. To install Universal Updater, get it from <a href="https://universal-team.net/projects/universal-updater.html" target="_blank">here</a>.

Once you have Universal Updater, simply open it and search for "Nimbus". Select `nimbus.3dsx` if you want to launch Nimbus from the Homebrew Launcher, or select `nimbus.cia` if you want to launch it from your HOME Menu.

### Without using Universal Updater

If you'd prefer not to use Universal Updater, Nimbus can be installed manually by extracting the needed files to your SD card.

Power off your console and insert its SD card into your computer.

You will need to download the [latest Nimbus release](https://github.com/PretendoNetwork/nimbus/releases/latest) from GitHub. You may choose the zip file labeled `cia.[version].zip` if you want to install Nimbus only to the HOME Menu, `3dsx.[version].zip` if you want to install Nimbus only to the Homebrew Launcher, or `combined.[version].zip` if you want to install Nimbus to both the HOME Menu and Homebrew Launcher.

<img src="/assets/images/docs/install/3ds/nimbus_release_page.png" width=100% height=auto/>

Copy the folder(s) from inside the zip file to the root of your SD card. If you are asked to merge or overwrite existing files, accept the changes.

Before putting the SD card back in your system, check that it contains all of the following files:

- `SD:/3ds/nimbus/update/000400300000BC02.ips` (Miiverse, JPN)
- `SD:/3ds/nimbus/update/000400300000BD02.ips` (Miiverse, USA)
- `SD:/3ds/nimbus/update/000400300000BE02.ips` (Miiverse, EUR)
- `SD:/3ds/nimbus/update/0004013000002902.ips` (HTTP)
- `SD:/3ds/nimbus/update/0004013000002E02.ips` (Sockets)
- `SD:/3ds/nimbus/update/0004013000002F02.ips` (SSL)
- `SD:/3ds/nimbus/update/0004013000003202.ips` (FRD/Friends)
- `SD:/3ds/nimbus/update/0004013000003802.ips` (ACT/NNID)
- `SD:/3ds/nimbus/update/juxt-prod.pem` (Juxtaposition certificate)
- `SD:/3ds/nimbus/update/nimbus.3gx` (Nimbus plugin for Luma)
- `SD:/3ds/nimbus.3dsx` (if you downloaded `3dsx` or `combined`)
- `SD:/cias/nimbus.cia` (if you downloaded `cia` or `combined`)

Once you've finished copying the files to your SD card, insert the SD card back into your 3DS/2DS system.

If you used the `3dsx` or `combined` zip files, open the Homebrew Launcher to launch Nimbus.

If you used the `cia` or `combined` zip files, you can install Nimbus to your HOME Menu. To do so, open FBI. If you do not have FBI, download the latest release from [GitHub](https://github.com/lifehackerhansol/FBI/releases/latest). Select `SD`, then `cias`. Find and select `nimbus.cia`. Select either `Install CIA` or `Install and delete CIA`. Once it has finished installing, press the HOME button and exit FBI. You should see a message that a new application has been added to the HOME Menu. Press A or tap OK and you'll now have Nimbus on your HOME Menu.

## Enabling Luma patches

In order to make use of the Pretendo Network service, you will need to enable Luma patches on your console. With your SD card inserted, hold `SELECT` + `Power` on your 3DS/2DS to turn it on and open the Luma configuration menu.

On the screen that is displayed, make sure that these following options are enabled:

- `Enable loading external FIRMS and modules`
- `Enable game patching`

Highlight each option with the D-Pad and press A to enable it. When finished, press `START` to save these changes and reboot the system.

## Using Nimbus

Depending on how you installed Nimbus, launch it either through the Homebrew Launcher or the HOME Menu. On first startup, the app will notify you that it has been updated. Press `START` to reboot the system, and then reopen Nimbus.

In the app, you can select `Pretendo` or `Nintendo` to swap between services. Your selection persists across reboots.

## Link a Pretendo Network ID (optional)

<div class="tip red">
	<strong>CAUTION:</strong>
	DON'T REMOVE YOUR NNID TO SET UP PRETENDO NETWORK. IT'S NOT NECESSARY, AND BY DOING SO, YOU WILL LOSE BADGES, REDOWNLOADABLE GAMES, THEMES, AND POKÉMON BANK DATA!
</div>

Some games and apps require a Pretendo Network ID (PNID) to be linked before you can use them online.

To link a PNID, open the System Settings app and click on `Nintendo Network ID Settings`. From here, you can either create a new PNID or link an existing one. Follow the directions on your screen to create or link a PNID. Please note that even though it says "Nintendo Network ID" throughout, you are still creating/linking a Pretendo Network ID. You may also register an account [on our website](/account/register) and link it to your console once you're ready.

<div class="tip red">
	<strong>CAUTION:</strong>
	A Pretendo Network ID may not use the same username as the account already linked to your 3DS/2DS! Ensure that you have chosen a different name for your PNID than the name on your NNID.
</div>

## Other information

### How does Nimbus work?

Nimbus creates a 2nd local account on your system so you can connect to Pretendo Network without it interfering with your main Nintendo Network account. Nimbus allows you to freely switch between Pretendo and Nintendo. Your selected mode will persist across reboots.

### 2nd local account?

You may have thought to yourself; _"2nd local account? What's that? I thought the 3DS only had one account?"_ And you'd be half right. The 3DS _normally_ supports only one account at a time. However, Nintendo implemented support for multiple local accounts on the 3DS/2DS as a feature for developers to use when testing their games, and it remains unused on all retail units. On a normal retail unit, only one local account is ever made, which is set to the `prod` NASC environment. Local accounts may be set to `prod`, `test` or `dev`. Nimbus makes use of this unused feature to create a local account in the `test` NASC environment. This is used in conjunction with the IPS patches, which make the `test` environment URLs point to Pretendo Network.

### Restoring Nintendo Badge Arcade Badges

Launching Nintendo Badge Arcade on Pretendo Network will result in your badges disappearing due to the locally saved data not matching the data stored on the server. To fix this and restore your badges, follow these steps:

1. Insert your SD Card into your PC.
2. Back up your badges at the folder on your SD Card `SD:Nintendo 3DS/ID0/ID1/extdata/00000000/000014d1`.
	- This step is optional, but recommended.
	- This is the encrypted data which can only be restored for this 3DS.
3. Download the latest version of [Simple Badge Injector](https://github.com/AntiMach/simple-badge-injector/releases/latest).
4. Insert your SD Card into your console.
5. Use Nimbus to switch to Pretendo.
6. Open Simple Badge Injector and choose the option to dump your badge data files.
	- This step is optional, but recommended.
	- This is the unencrypted data and can be restored onto any 3DS.
7. Still inside SBI, select the option to fix your NNID/PNID.
8. You can now exit SBI, and your badges should now be back.

All badges _placed_ on the HOME Menu might be deleted, and you might have to re-add them in the order you had them before.

If you encounter any errors, first try restoring your backed up badge data through SBI. If that fails, try restoring the encrypted data directly.

Badges disappear when switching between Pretendo Network and Nintendo Network, to make them reappear (even if not on the home menu) just use the fix your NNID/PNID option inside SBI.
