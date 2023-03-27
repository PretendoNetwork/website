# Wii U

<div class="tip">
	ℹ️ This guide assumes that you have a real Wii U console running homebrew. If you don't, please first follow <a href="https://wiiu.hacks.guide/" target="_blank">this guide</a> on how to homebrew your system, or <a href="/docs/install/cemu">this guide</a> on how to connect to Pretendo Network on Cemu.
</div>

Welcome to Pretendo Network! [Already have Pretendo installed, but need help making your Pretendo Network ID?](#creating-and-using-a-pretendo-network-id)

Select the homebrew environment you're currently using:
- ### [Tiramisu](#tiramisu-1)
- ### [Aroma](#aroma-1)
- ### [Other](#other-1)

# Tiramisu

To connect to Pretendo Network using Tiramisu, you must use the [Nimble](https://github.com/PretendoNetwork/Nimble) module. There are 2 ways of obtaining the patch; either the stable release version, or the bleeding edge version.

### Stable
Download Nimble by clicking [here](https://github.com/PretendoNetwork/Nimble/releases/latest/download/30_nimble.rpx). A `30_nimble.rpx` file will download. 

Place that file on your SD card at `sd:/wiiu/environments/tiramisu/modules/setup/`.

If `50_hbl_launcher.rpx` is on your SD card, remove it for now - otherwise, it'll get in the way of us making a Pretendo Network ID later. Your SD card should now look something like this:

<img src="/assets/images/docs/install/wiiu/tiramisu/sd-card.png" width=100% height=auto/>

Place your SD card back into your console and boot like normal. [Click here to continue setup!](#creating-and-using-a-pretendo-network-id)

### Bleeding Edge
[Login to your GitHub account](https://github.com/login) (or [create one](https://github.com/signup) if you don't already have one).

Navigate to the [Actions](https://github.com/PretendoNetwork/Nimble/actions) page on the Nimble GitHub repository.

<img src="/assets/images/docs/install/wiiu/tiramisu/actions-highlight.png" width=100% height=auto/>

Select the `Nimble-CI` workflow and select the latest workflow run. _**Note:** At this stage you may also use the provided filters to only grab builds from specific branches, events, etc. By default the latest build, regardless of branch, is always shown._

<img src="/assets/images/docs/install/wiiu/tiramisu/workflow-highlight.png" width=100% height=auto/>

Select the `nimble` artifact. This will download a `nimble.zip` zip file.

<img src="/assets/images/docs/install/wiiu/tiramisu/artifact-highlight.png" width=100% height=auto/>

Extract `nimble.zip` and place the extracted `30_nimble.rpx` file on your SD card at `sd:/wiiu/environments/tiramisu/modules/setup/`

<img src="/assets/images/docs/install/wiiu/tiramisu/sd-card.png" width=100% height=auto/>

Place your SD card back into your console and boot like normal. [Click here to continue setup!](#creating-and-using-a-pretendo-network-id)

# Aroma

To connect to Pretendo Network using Aroma, you must use the [Inkay](https://github.com/PretendoNetwork/Inkay) plugin. There are 2 ways of obtaining the patch; either the stable release version, or the bleeding edge version.

### Stable
Download Inkay by clicking [here](https://github.com/PretendoNetwork/Inkay/releases/latest/download/Inkay-pretendo.wps). A `Inkay-pretendo.wps` file will download. Place the downloaded `Inkay-pretendo.wps` file on your SD card at `sd:/wiiu/environments/aroma/plugins/`.

<img src="/assets/images/docs/install/wiiu/aroma/sd-card.png" width=100% height=auto/>

Place your SD card back into your console and boot like normal. [Click here to continue setup!](#creating-and-using-a-pretendo-network-id)

### Bleeding Edge
[Login to your GitHub account](https://github.com/login) (or [create one](https://github.com/signup) if you don't already have one).

Navigate to the [Actions](https://github.com/PretendoNetwork/Inkay/actions) page on the Aroma GitHub repository.

<img src="/assets/images/docs/install/wiiu/aroma/actions-highlight.png" width=100% height=auto/>

Select the `Inkay-CI` workflow and select the latest workflow run. _**Note:** At this stage you may also use the provided filters to only grab builds from specific branches, events, etc. By default the latest build, regardless of branch, is always shown._

<img src="/assets/images/docs/install/wiiu/aroma/workflow-highlight.png" width=100% height=auto/>

Select the `inkay` artifact. This will download a `inkay.zip` zip file.

<img src="/assets/images/docs/install/wiiu/aroma/artifact-highlight.png" width=100% height=auto/>

Extract `inkay.zip` and place the extracted `Inkay-pretendo.wps` file on your SD card at `sd:/wiiu/environments/aroma/plugins`.

<img src="/assets/images/docs/install/wiiu/aroma/sd-card.png" width=100% height=auto/>

Place your SD card back into your console and boot like normal. [Click here to continue setup!](#creating-and-using-a-pretendo-network-id)

# Other

Pretendo does not officially support other homebrew environments anymore, such as legacy ones including Haxchi/CBHC. **Please consider upgrading to Tiramisu/Aroma.**

Legacy releases of the patcher may be found in old [releases](https://github.com/PretendoNetwork/Nimble/releases), and the source code may be found in the [old_hbl](https://github.com/PretendoNetwork/Nimble/tree/old_hbl) and [old_hbl_inkay](https://github.com/PretendoNetwork/Nimble/tree/old_hbl_inkay) branches on GitHub. However, you will need to build these patches from source, and they will *NOT* be receiving any updates or technical support.

---

# Creating and using a Pretendo Network ID

Now that Pretendo Network's basic patches have been installed, we can create a Pretendo Network ID. There are currently two ways of creating a PNID; either by directly creating an account on your Wii U, or creating it with the website and linking later.

## Choose where you'd like to create your account
- ### [Wii U](#wii-u-2)
- ### [Website](#website-1)

### Wii U

Start up your Wii U and get to the user selection screen. For some users, this will be where they first go, but others may have to press a profile icon in the top-left. After pressing the icon, press `Switch Account` or `Switch User`.

Once you get to the user selection screen, press (Plus) or `Add New User`. 

When asked if you already have a Nintendo Network ID, choose `No`. After making your Mii, you will be greeted with a language selection that will take you to a Network Services Agreement.

**STOP!** Read carefully, and make sure that this is the Pretendo Network Services Agreement and not just the regular Network Services Agreement.

<img src="/assets/images/docs/install/wiiu/pnid/pretendo-eula.png" width=100% height=auto/>

If it reads as above (or, at the very least, mentions Pretendo), then you're connected to Pretendo Network and can progress safely to create your ID like you would a regular Nintendo Network ID. Otherwise, make sure you've [installed Pretendo Network's basic patches](#select-your-homebrew-environment).

You've now created and started using a Pretendo Network ID! 

<img src="/assets/images/docs/install/wiiu/pnid/pnid-created.png" width=100% height=auto/>

If you'd like to additionally setup Miiverse, [head here to learn how](/docs/install/juxt).

### Website
Go to the account login page [here](/account) and click `Don't have an account?` to register.

<img src="/assets/images/docs/install/wiiu/pnid/register-account-web.png" width=100% height=auto/>

Do not use the same Pretendo Network ID as your current Nintendo Network ID. The Wii U will not let you add the same ID more than once.

After registering, start up your Wii U and login as a user you currently have. Press the profile icon in the top-left.

If you *did* get error 102-2402 when logging in, then you're connected to Pretendo! If you didn't, you can still check. Scroll all the way down, and choose `View Network Services Agreement`.

**STOP!** Read carefully, and make sure that this is the Pretendo Network Services Agreement and not just the regular Network Services Agreement.

<img src="/assets/images/docs/install/wiiu/pnid/pretendo-eula2.png" width=100% height=auto/>

If it reads as above (or, at the very least, mentions Pretendo), then you're connected to Pretendo Network and can progress safely. Otherwise, make sure you've [installed Pretendo Network's basic patches](#select-your-homebrew-environment).

Now that we've checked, scroll back up to the top of the menu to continue along.

Press `Switch Account` or `Switch User` to get to the user selection screen, then press (Plus) or `Add New User`. 

When asked if you already have a Nintendo Network ID, choose `Yes`. Say `Yes` again when it asks if you want to link an existing ID.

Enter the username, password, and email we entered on the website.

<img src="/assets/images/docs/install/wiiu/pnid/pnid-username2.png" width=100% height=auto/>

After confirming the information is correct, you'll be asked if you're sure that you want to link the account. Choose `Link`.

<img src="/assets/images/docs/install/wiiu/pnid/pnid-link.png" width=100% height=auto/>

You've now created and started using a Pretendo Network ID!

<img src="/assets/images/docs/install/wiiu/pnid/pnid-created.png" width=100% height=auto/>

If you'd like to additionally setup Miiverse, [head here to learn how](/docs/install/juxt).

---

Welcome to Pretendo Network!

If you encounter (or have encountered) any errors, try [searching](/docs/search) for the error code. If that doesn't work, join our [Discord](https://invite.gg/pretendo), and either ask the #support channel for help or get in touch with a developer.