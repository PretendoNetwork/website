<div class="tip green">This Guide may be missing some info or incomplete.</div>

# Cemu

<div class="tip red">
	<strong>Cemu support is experimental!</strong>
	Cemu does not currently have a (working) way of redriecting to custom servers. Because of this, we must hook into the Cemu process and patch parts of the program memory, much like how our Wii U patch works. This is not officially supported by Cemu or it's developers, and may have issues or fail to work entirely.
</div>

## Online files
Cemu requires the use of several files obtained via dumping from real hardware. You may use those files if you have a physical Wii U, they will work just fine. If you _don't_ have a real Wii U navigate to [your account page](/account) and select <strong>`Download account files`</strong>

<center><img src="/assets/images/docs/install/cemu/download-account-files.png"/></center>

## Setup Cemu for online
After obtaining the files needed for online play refer to the official [Cemu Online Play](https://cemu.cfw.guide/online-play.html) guide

<div class="tip">
	<strong>Note! If you downloaded the account files from your Pretendo Network account you may skip the steps on the Cemu guide which dumps them from a console. However these files will not work on Nintendo Network. For compatibility with both servers, use files dumped from a real console</strong>
</div>

## Installing Pretendo
Once you have Cemu setup for online play navigate to our [Cemu Patcher](https://github.com/PretendoNetwork/cemu-patcher) repository. To build from scratch, clone the repository and open in Visual Studio and build the solution. To download the latest pre-built release, head to the [releases](https://github.com/PretendoNetwork/cemu-patcher/releases) page and download the latest `cemuhook.dll`

Place `cemuhook.dll` in the same folder as `Cemu.exe` and run Cemu. Cemu should automatically detect `cemuhook.dll` and load it. You may now go online with Pretendo!

## The patch doesn't seem to work?
Due to the experimental state of Cemu support, our patch may fail to load at times. This could be caused by changes in Cemu, your systems anti-virus, bugs in our programming, and more. We are looking into more stable patches. If the hook fails to load, try renaming `cemuhook.dll` to `dbghelp.dll` and restarting Cemu. If this does not work, you may need to contact a developer. Please be patient as we try to figure out the cause of the issue and any potential solutions

<div class="tip">
	<strong>Please be warned that in some cases the patch fails for completely unknown reasons. There have been cases where different users on the same operating system, using the same Cemu version, playing the same game, experience different results. In these cases there is not much to do besides trying a different machine or Cemu version.</strong>
</div>

## What about Cemuhook by Rajkosto?
You may have noticed that Cemu automatically searches for loads DLL files named `cemuhook.dll`. This is intended for use with Cemuhook developed by Rajkosto. We hijack the DLL name in order to get Cemu to load our hook automatically. If you would like to still use Cemuhook by Rajkosto with Pretendo, name the Cemuhook by Rajkosto DLL to `true_cemuhook.dll` while keeping the Pretendo hook named `cemuhook.dll`. Our patcher will look for a DLL named `true_cemuhook.dll` and load it automatically. This is not officially supported by Rajkosto and may cause issues. Use at your own risk.

## Wine/Linux support?
The Pretendo patches do work under wine. Rename `cemuhook.dll` to `dbghelp.dll` and place `dbghelp.dll` in the same folder as `Cemu.exe`. Run `winecfg` and navigate to `Libraries` and make sure `dbghelp` is added to the override list. Select it and click `Edit` and ensure the override is set to `Native then Builtin`. Wine should now allow your local `dbghelp.dll` override the built-in DLL