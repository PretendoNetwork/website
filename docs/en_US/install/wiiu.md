# Wii U

<div class="tip">
	ℹ️ This guide assumes that you have a <b>Homebrewed System</b>, if you don't please follow this <a href="https://wiiu.hacks.guide/" target="_blank">guide</a> on how to homebrew your system first.
</div>

## Select your homebrew environment

- ### [Tiramisu](#tiramisu-1)
- ### [Aroma](#aroma-1)
- ### [Legacy](#legacy-1)

## Already have Pretendo installed? Setup a PNID then

- ### [PNID Setup](#pnid-setup-1)


# Tiramisu

To connect to Pretendo Network using Tiramisu you must use the [Nimble](https://github.com/PretendoNetwork/Nimble) set up module. There are 2 ways of obtaining the patch, either the stable release version or the bleeding edge version.

### Tiramisu - Stable
Navigate to the [releases](https://github.com/PretendoNetwork/Nimble/releases) page on the Nimble GitHub repository

<img src="/assets/images/docs/install/wiiu/tiramisu/releases-highlight.png" width=100% height=auto/>

Now download the `30_nimble.rpx` file from the latest release

<img src="/assets/images/docs/install/wiiu/tiramisu/rpx-highlight.png" width=100% height=auto/>

Place the downloaded `30_nimble.rpx` file on your SD card at `sd:/wiiu/environments/tiramisu/modules/setup`

<img src="/assets/images/docs/install/wiiu/tiramisu/sd-card.png" width=100% height=auto/>

Place your SD card back into your console and boot like normal. You should now be connected to Pretendo Network

### Tiramisu - Bleeding Edge
Navigate to the [actions](https://github.com/PretendoNetwork/Nimble/actions) page on the Nimble GitHub repository

<img src="/assets/images/docs/install/wiiu/tiramisu/actions-highlight.png" width=100% height=auto/>

Select the `Nimble-CI` workflow and select the latest workflow run. _**Note:** At this stage you may also use the provided filters to only grab builds from specific branches, events, etc. By default the latest build, regardless of branch, is always shown._

<img src="/assets/images/docs/install/wiiu/tiramisu/workflow-highlight.png" width=100% height=auto/>

Select the `nimble` artifact. This will download a `nimble.zip` zip file

<img src="/assets/images/docs/install/wiiu/tiramisu/artifact-highlight.png" width=100% height=auto/>

Extract `nimble.zip` and place the extracted `30_nimble.rpx` file on your SD card at `sd:/wiiu/environments/tiramisu/modules/setup`

<img src="/assets/images/docs/install/wiiu/tiramisu/sd-card.png" width=100% height=auto/>

Place your SD card back into your console and boot like normal. You should now be connected to Pretendo Network

# Aroma

To connect to Pretendo Network using Aroma you must use the [Inkay](https://github.com/PretendoNetwork/Inkay) plugin. There are 2 ways of obtaining the patch, either the stable release version or the bleeding edge version.

### Aroma - Stable
Navigate to the [releases](https://github.com/PretendoNetwork/Aroma/releases) page on the Aroma GitHub repository

<img src="/assets/images/docs/install/wiiu/aroma/releases-highlight.png" width=100% height=auto/>

Now download the `Inkay-pretendo.wps` file from the latest release

<img src="/assets/images/docs/install/wiiu/aroma/wps-highlight.png" width=100% height=auto/>

Place the downloaded `Inkay-pretendo.wps` file on your SD card at `sd:/wiiu/environments/aroma/plugins`

<img src="/assets/images/docs/install/wiiu/aroma/sd-card.png" width=100% height=auto/>

Place your SD card back into your console and boot like normal. You should now be connected to Pretendo Network

### Aroma - Bleeding Edge
Navigate to the [actions](https://github.com/PretendoNetwork/Aroma/actions) page on the Aroma GitHub repository

<img src="/assets/images/docs/install/wiiu/aroma/actions-highlight.png" width=100% height=auto/>

Select the `Inkay-CI` workflow and select the latest workflow run. _**Note:** At this stage you may also use the provided filters to only grab builds from specific branches, events, etc. By default the latest build, regardless of branch, is always shown._

<img src="/assets/images/docs/install/wiiu/aroma/workflow-highlight.png" width=100% height=auto/>

Select the `inkay` artifact. This will download a `inkay.zip` zip file

<img src="/assets/images/docs/install/wiiu/aroma/artifact-highlight.png" width=100% height=auto/>

Extract `inkay.zip` and place the extracted `Inkay-pretendo.wps` file on your SD card at `sd:/wiiu/environments/aroma/plugins`

<img src="/assets/images/docs/install/wiiu/aroma/sd-card.png" width=100% height=auto/>

Place your SD card back into your console and boot like normal. You should now be connected to Pretendo Network


# Legacy

Pretendo does not officially support legacy homebrew environments (Haxchi/CBHC) anymore. Legacy releases of the patcher may be found in old [releases](https://github.com/PretendoNetwork/Nimble/releases), and the source code may be found in the [old_hbl](https://github.com/PretendoNetwork/Nimble/tree/old_hbl) and [old_hbl_inkay](https://github.com/PretendoNetwork/Nimble/tree/old_hbl_inkay) branches on GitHub. However you will need to build these patches from source, and they will _**not**_ be receiving any updates or technical support. Please consider upgrading to Tiramisu/Aroma


# PNID Setup

After installing Pretendo, you will need to create a PNID to use our services. There is currently two ways of creating a PNID, by creating an account with the website and linking it or creating it on your Wii U.

### PNID Setup - Website
You will want to register an account from [here](/account) and click `Don't have an account?` to register.

<img src="/assets/images/docs/install/wiiu/pnid/register-account-web.png" width=100% height=auto/>

Right before registering a PNID, please make sure to save your password on some sort of note, as you will not be able to reset your password. After registering just simply change your birth date, gender, timezone, country/region, etc to what you see fit. Once you have it set up we can switch back to the Wii U. Within your Wii U you will want to reconnect to Pretendo _**Note:** how you reconnect to Pretendo depends on how you installed it on your Wii U!_ Once you are reconnected, you will want to press the top left profile icon and press `Switch Account`, then press `Add New User`. Go through the user set up normally, but when it asks if you have an account, press `Yes` and put in your username and password. If it asks you to confirm your email afterwards, simply skip it. You will now be able to use Pretendo Servers

### PNID Setup - Wii U
Right before registering a PNID, please make sure to save your password on some sort of note, as you will not be able to reset your password. You will want to go on you Wii U while Pretendo is still active and press the top left profile icon. After pressing the icon, press `Switch Account`, and then `Add New User`. Set up this account as normal, but once it asks if you have an account, press `No` and go through the account process normally. When it asks you again to you want to link after adding a mii, press `Link`. Choose your language and then accept the Pretendo Network Service Agreement.

<img src="/assets/images/docs/install/wiiu/pnid/pretendo-eula.png" width=100% height=auto/>

Finally, set up your pnid, email and password. Once all of this is done you will be able to use Pretendo Server