<div class="tip green">This Guide may be missing some info or incomplete.</div>

# Cemu

## Download
<div class="tip red">
	<strong>Note:</strong>
	Only experimental builds of Cemu 2.0 are supported. At this time Cemu does not have a stable release of Cemu 2.0 which supports Pretendo
</div>

Cemu 2.0 has official built-in support for Pretendo as of October 10, 2022. Head to the Cemu GitHub [releases](https://github.com/cemu-project/Cemu/releases) page and download the latest Cemu experimental release (tagged as `Pre-release`). Only `Cemu 2.0-5 (Experimental)` and above is supported at the moment. Additionally you may build Cemu from source using the provided [build instructions](https://github.com/cemu-project/Cemu/blob/main/BUILD.md)

## Online files
Cemu requires the use of several files obtained via dumping from real hardware. You may use those files if you have a physical Wii U, they will work just fine when connecting to Pretendo. If you _don't_ have a real Wii U navigate to [your account page](/account) and select <strong>`Download account files`</strong>

<center><img src="/assets/images/docs/install/cemu/download-account-files.png"/></center>

<div class="tip red">
	<strong>Note:</strong>
	These online files are scrubbed of all console information and are stubbed enough for Cemu to think they are from real hardware. These files <strong>MAY</strong> fail to work correctly. Support for these files is very limited, and it is recommended to use files from a real console
</div>

## Setup Cemu for online
After obtaining the files needed for online play refer to the official [Cemu Online Play](https://cemu.cfw.guide/online-play.html) guide

<div class="tip">
	<strong>Note! If you downloaded the account files from your Pretendo Network account you may skip the steps on the Cemu guide which dumps them from a console. However these files will not work on Nintendo Network. For compatibility with both servers, use files dumped from a real console</strong>
</div>

## Connecting to Pretendo
Once you have Cemu setup for online play navigate to `Options > General settings > Account`. You should now see a section titled `Network Service`. Select your PNID from the `Active account` menu and select the `Pretendo` Network Service option. Cemu should now be connected to Pretendo's servers

<center><img src="/assets/images/docs/install/cemu/network-services-settings.png"/></center>

## Miiverse
Cemu has limited to no Miiverse support as of now. Currently no Miiverse features, including the Miiverse applet as well as Miiverse features in games, will function.