<div class="tip green">This Guide may be missing some info or incomplete.</div>

# Cemu

<div class='tip'>
	In Order to use Pretendo on Cemu, you need to have Pretendo already installed on your Wii U. For Wii U please follow the <a href='/docs/install/wiiu'>Wii U Guide</a>
</div>

## Download

<div class="tip red">
	<strong>Note:</strong>
	Only experimental builds of Cemu 2.0 are supported. At this time Cemu does not have a stable release of Cemu 2.0 which supports Pretendo
</div>

Cemu 2.0 has official built-in support for Pretendo as of October 10, 2022. Head to the Cemu GitHub [releases](https://github.com/cemu-project/Cemu/releases) page and download the latest Cemu experimental release (tagged as `Pre-release`). Only `Cemu 2.0-5 (Experimental)` and above is supported at the moment. Additionally you may build Cemu from source using the provided [build instructions](https://github.com/cemu-project/Cemu/blob/main/BUILD.md)

## Dumping your pretendo account

Ensure you have followed [Cemu's guide](https://cemu.cfw.guide/online-play.html) to set up the emulator for online play. When dumping your user account files, ensure you select your PNID.

## Connecting to Pretendo

Once you have Cemu setup for online play navigate to `Options > General settings > Account`. You should now see a section titled `Network Service`. Select your PNID from the `Active account` menu and select the `Pretendo` Network Service option. Cemu should now be connected to Pretendo's servers

<center><img src="/assets/images/docs/install/cemu/network-services-settings.webp" alt="Screenshot of Cemu's Account Settings with different Network Service Options."/></center>

## Miiverse

Cemu has limited to no Miiverse support as of now. Some in game features may work, but this is not guaranteed. The Miiverse applet does not work in official builds.
