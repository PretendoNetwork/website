# Azahar

<div class="tip red">
	<strong>CAUTION:</strong>
	This guide only supports official builds provided by the Azahar Emulator team. Any unofficial/third-party emulator builds are not supported, and we do not provide technical support for issues caused by using said unofficial builds.
</div>

<div class="tip">
	ℹ️ Azahar <b>requires</b> connecting to a real 3DS/2DS system using an app called Artic Setup Tool before you can play online. This guide assumes that you have a <b>Homebrewed System running the latest version of Luma3DS (v13.3.1 or higher)</b>. If you don't, please follow this <a href="https://3ds.hacks.guide/" target="_blank">guide</a> on how to install homebrew to your system first.
</div>

The following steps are required for you to connect to Pretendo Network:

1. [Downloading Artic Setup Tool](#downloading-artic-setup-tool)
2. [Using Artic Setup Tool](#using-artic-setup-tool)
3. [LLE module setup in Azahar](#lle-module-setup-in-azahar)
4. [Downloading Nimbus](#downloading-nimbus)
5. [Using Nimbus](#using-nimbus)
6. [Link a Pretendo Network ID (optional)](#link-a-pretendo-network-id-optional)

## Downloading Artic Setup Tool

### Using Universal Updater

The easiest way to get Artic Setup Tool is by using Universal Updater. Universal Updater is also great for updating all of your other homebrew apps, so installing it is highly recommended. To install Universal Updater, get it from <a href="https://universal-team.net/projects/universal-updater.html" target="_blank">here</a>.

Once you have Universal Updater, simply open it and search for "Artic Setup Tool". Select `AzaharArticSetup.3dsx` if you want to launch the setup tool from the Homebrew Launcher, or select `AzaharArticSetup.cia` if you want to launch it from your HOME Menu.

### Without using Universal Updater

If you'd prefer not to use Universal Updater, Artic Setup Tool can be installed manually using the FBI title manager.

Before starting, power off your console and insert its SD card into your computer.

If you want to launch Artic Setup Tool from your HOME Menu, download `AzaharArticSetup.cia` from the [latest Artic Setup Tool release](https://github.com/azahar-emu/ArticSetupTool/releases/latest) and put it on your SD card. Then, open FBI and install it.

If you want to launch Artic Setup Tool from the Homebrew Launcher, download `AzaharArticSetup.3dsx` from the [latest Artic Setup Tool release](https://github.com/azahar-emu/ArticSetupTool/releases/latest) and put it inside the `3ds` folder on your SD card.

## Using Artic Setup Tool

<div class="tip">
	ℹ️ Before opening Artic Setup Tool, ensure that your 3DS/2DS is on the same Wi-Fi network as the computer running Azahar.
</div>

Open Artic Setup Tool on your 3DS/2DS. Once it's open, press A to run the tool. An IP address will be displayed on the top screen.

<img src="/assets/images/docs/install/azahar/artic_setup_tool.png" width=100% height=auto/>

If your system's top screen is broken, hold L + D-Pad Down + SELECT to open the Rosalina menu, then go to `Debugger options...` and enable the debugger, then press B. Your IP address will be displayed in the top-right corner of the bottom screen. Write down this IP address somewhere, then disable the debugger and exit the Rosalina menu.

Open Azahar on your computer. Click `File`, then `Set Up System Files...`. A window will pop up containing some information and a text box. `Old 3DS Setup` will be selected regardless of what system you have. <b>This is normal.</b> Enter your 3DS/2DS IP address into the text box in Azahar and click OK.

<img src="/assets/images/docs/install/azahar/azahar_set_up_enterIP.png" width=100% height=auto/>

<div class="tip yellow">
	⚠️ If you see an error that says "Missing OTP backup on SD card", you need to remove your 3DS/2DS system's battery and reinsert it to generate the OTP backup.
</div>

<div class="tip yellow">
	⚠️ If you see an error that says "The country configuration does not match the console region", you need to change the country set in Azahar to match the region of your system. To do this, click "Emulation", then "Configure", then click "System". Find the country drop-down box and select your system's country from the list, then click OK to save your configuration settings. <b>Please note that "Country" and "Region" are two separate drop-down boxes in Azahar.</b> "Country" is the one that needs to be changed to fix this issue.
</div>

On Azahar, a screen will appear telling you to "update your system". This is actually a process that downloads some required system files from the 3DS update servers so that Azahar can connect online. This won't modify anything on your 3DS/2DS system. Click OK to allow it to proceed.

<img src="/assets/images/docs/install/azahar/azahar_set_up_sysupdate.png" width=100% height=auto/>

After a few minutes, Azahar will notify you that the update is complete. Click OK to continue. <b>You are not finished with Artic Setup Tool.</b>

In Azahar, click `File` and `Set Up System Files...` again. Enter the IP address again, but this time, click `New 3DS Setup`. <b>This is required and will work regardless of whether or not your system is a New 3DS/2DS.</b> Click OK.

<img src="/assets/images/docs/install/azahar/azahar_set_up_enterIP_N3DS.png" width=100% height=auto/>

Once again, a screen will appear on Azahar telling you to "update your system". Click OK to allow it to proceed.

<img src="/assets/images/docs/install/azahar/azahar_set_up_sysupdate_N3DS.png" width=100% height=auto/>

Another screen will appear telling you some important information about system updates. Review this information and click "I Accept" to proceed to the update.

Once the update is complete, click OK.

On your 3DS/2DS system, press START to exit Artic Setup Tool. Your 3DS/2DS system is no longer needed for the rest of this guide.

## LLE module setup in Azahar

In Azahar, click `Emulation`, then `Configure`.

Select the `System` menu and click `Enable required LLE modules for online features`. Make sure this box is checked, then click OK. Please note that you will not be able to use savestates while this option is enabled, but you will not be able to connect online when it is disabled.

<img src="/assets/images/docs/install/azahar/azahar_emulation_configure_LLE_module.png" width=100% height=auto/>

## Downloading Nimbus

Download the [latest Nimbus release](https://github.com/PretendoNetwork/Nimbus/releases/latest). Be sure to select a zip file labeled either `cia` or `combined`. Once downloaded, extract this zip file.

Open your emulator's SDMC folder. By default, this will be located in the main Azahar folder. To get there, click `File` and `Open Azahar Folder`. A file explorer window will open. Enter the `sdmc` folder and paste the `3ds` folder from the zip file into there. If everything goes correct, inside the `sdmc` folder you should have two folders named `3ds` and `Nintendo 3DS` (with the `Nintendo 3DS` folder already being present).

Close Azahar and re-open it. Click `File` and `Install CIA`. Navigate into the `cias` folder from the zip file and select `nimbus.cia`, then click OK. This will install Nimbus to your emulator.

## Using Nimbus

Open Nimbus within Azahar. Upon opening it, it will notify you that it's been updated. Click `Emulation` and then `Stop` to exit it.

<img src="/assets/images/docs/install/azahar/azahar_nimbus_update.png" width=100% height=auto/>

Reopen Nimbus and click the Pretendo button. Once you have switched to Pretendo, click `Emulation` and then `Stop` to exit Nimbus again.

<img src="/assets/images/docs/install/azahar/azahar_nimbus_pretendo_select.png" width=100% height=auto/>

Once you're connected to Pretendo Network, you may want to open the HOME Menu and check the Friend List to confirm that you've been assigned a friend code. Please note that Artic Setup Tool does not copy your account or save data from your system.

## Link a Pretendo Network ID (optional)

Some games and apps require a Pretendo Network ID (PNID) to be linked before you can use them online. To link a PNID, open the System Settings app in Azahar and click on `Nintendo Network ID Settings`. From here, you can either create a new PNID or link an existing one. Follow the directions on your screen to create or link a PNID. Please note that even though it says "Nintendo Network ID" throughout, you are still creating/linking a Pretendo Network ID.
