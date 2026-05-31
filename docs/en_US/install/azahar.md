# Azahar

<div class="tip">
	ℹ️ Azahar <b>requires</b> connecting to a real 3DS/2DS system before you can play online. This guide assumes that you have a <b>Homebrewed System running the latest version of Luma3DS (v13.3.1 or higher)</b>. If you don't, please follow this <a href="https://3ds.hacks.guide/" target="_blank">guide</a> on how to install homebrew to your system first.
</div>

The following steps are required for you to connect to the Pretendo Network:

1. [Downloading Artic Setup Tool](#downloading-artic-setup-tool)
2. [Using Artic Setup Tool](#using-artic-setup-tool)
3. [LLE module setup in Azahar](#lle-module-setup-in-azahar)
4. [Downloading Nimbus](#downloading-nimbus)
5. [Using Nimbus](#using-nimbus)
6. [Link a PNID (optional)](#link-a-pretendo-network-id-optional)

## Downloading Artic Setup Tool

### Using Universal Updater

Universal Updater is the easiest way to get Artic Setup Tool. Universal Updater also comes highly recommended for updating all of your other homebrew apps, so installing it is highly recommended. To install Universal Updater, follow <a href="https://universal-team.net/projects/universal-updater.html" target="_blank">this guide</a>.

Once you have Universal Updater, open it and tap the search button on the bottom screen. Type "Artic Setup Tool" into the search box, then tap OK.

Tap the "i" icon on the upper-left corner of the bottom screen, and you should see the item page for Artic Setup Tool. Press A to install it.

Select `AzaharArticSetup.3dsx` if you want to launch the setup tool from the Homebrew Launcher, or select `AzaharArticSetup.cia` if you want to launch it from your HOME Menu.

After a short while, you should see a message pop up on the top screen telling you that the tool has been installed. Exit to the HOME Menu and close out Universal Updater.

Artic Setup Tool is now installed. If you selected the `.cia` file, you should see a message that a new application has been added to the HOME Menu. Press A and you'll now have Artic Setup Tool on your HOME Menu.

### Direct title install

Before starting, power off your console and insert its SD card into your computer.

You may choose between installing Artic Setup Tool to your HOME Menu or to the Homebrew Launcher.

#### Install to HOME Menu

If you want to launch Artic Setup Tool from your HOME Menu, download `AzaharArticSetup.cia` from the [latest Artic Setup Tool release](https://github.com/azahar-emu/ArticSetupTool/releases/latest) and put it inside the `cias` folder on your SD card. If the `cias` folder doesn't exist on your SD card, create it.

Insert your SD card back into your console.

Open FBI. If you do not have FBI, download the latest release from [GitHub](https://github.com/lifehackerhansol/FBI/releases/latest). Select `SD`, then `cias`. Find and select `AzaharArticSetup.cia`. Select either `Install CIA` or `Install and delete CIA`.

Once it has finished installing, press the HOME button and exit FBI. You should see a message that a new application has been added to the HOME Menu. Press A and you'll now have Artic Setup Tool on your HOME Menu.

#### Install to Homebrew Launcher

If you want to launch Artic Setup Tool from the Homebrew Launcher, download `AzaharArticSetup.3dsx` from the [latest Artic Setup Tool release](https://github.com/azahar-emu/ArticSetupTool/releases/latest) and put it inside the `3ds` folder on your SD card.

Insert your SD card back into your console. From here, you can open the Homebrew Launcher and run the Setup Tool.

## Using Artic Setup Tool

<div class="tip">
	ℹ️ Before opening Artic Setup Tool, ensure that your 3DS/2DS is on the same Wi-Fi network as the computer running Azahar.
</div>

Open Artic Setup Tool on your 3DS/2DS. Once it's open, press A to run the tool. An IP address will be displayed on the top screen.

Open Azahar on your computer. Click `File`, then `Set Up System Files...`

Enter the IP address you see on the top screen into the text box in Azahar, making sure to include the `:5543` at the end. Click OK.

On Azahar, a screen will appear telling you to "update your Nintendo 3DS system". Click OK to allow the update to proceed.

After a few minutes, Azahar will notify you that the update is complete. Click OK to continue. <b>You are not finished with Artic Setup Tool.</b>

In Azahar, click `File` and `Set Up System Files...` again. Enter the IP address again, and this time, click `New 3DS Setup`. <b>This will work regardless of whether or not your system is a New 3DS/2DS.</b> Click OK.

Once again, a screen will appear on Azahar telling you to "update your Nintendo 3DS system". Click OK to allow the update to proceed. Another screen will appear telling you some important information about system updates. Review this information and click "I Accept" to proceed to the update.

Once the update is complete, click OK.

On your 3DS/2DS system, press START to exit Artic Setup Tool. You are now done with your 3DS/2DS system for this setup. It is no longer needed for the rest of this process.

## LLE module setup in Azahar

In Azahar, click `Emulation`, then `Configure`.

Select the `System` menu and click `Enable required LLE modules for online features`. Make sure this box is checked, then click OK.

## Downloading Nimbus

Download the [latest Nimbus release](https://github.com/PretendoNetwork/Nimbus/releases/latest). Be sure to select a zip file labeled either `cia` or `combined`. Once downloaded, extract this zip file.

In Azahar, click `File` and `Open Azahar Folder`. A file explorer window will open. Enter the `sdmc` folder and paste the `3ds` and `cias` folders from the zip file here. If everything goes correct, you should have these two folders in `sdmc` alongside a folder called `Nintendo 3DS`.

Close Azahar and re-open it. Click `File` and `Install CIA`. Navigate into the `cias` folder from the zip file and select `Nimbus.cia`. This will install Nimbus to your emulator.

## Using Nimbus

Open Nimbus within Azahar. Upon opening it, it will notify you that it's been updated. Press START on your controller to restart the system, or press M on your keyboard. Nimbus should automatically reopen itself.

Upon Nimbus reopening, click the Pretendo button. Once you have switched to Pretendo, click `Emulation` and then `Stop` to exit Nimbus.

## Link a Pretendo Network ID (optional)

To link a Pretendo Network ID (PNID), which is required for some features such as Juxtaposition, open the System Settings app in Azahar and click on Nintendo Network ID settings. From here, you can either link an existing PNID or create a new one. Follow the directions on screen to create/link a PNID.
