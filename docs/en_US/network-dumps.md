# Network Dumps
One of the best ways to support the project is to help in gathering network dumps of games. These network dumps can be used by developers to help understand how the servers operate in a live environment. This kind of data greatly simplifies development of the servers, as it removes a large amount of guesswork and reverse engineering.

In order to make this easier, we have developed a suite of internal tools to capture and read network traffic, as well as make use of several "off the shelf" tools. This document will go into detail about how to capture these packets yourself, and how you can submit them to us for use in research and development. This document will be fairly long, please read it completely before submitting any dumps.

## Table of Contents
1. [Submissions](#submissions)
2. [Game Packets](#game-packets)
	- [Wii U (HokakuCafe)](#wii-u-hokakucafe)
	- [3DS (HokakuCTR)](#3ds-hokakuctr)
	- [All (WireShark)](#all-wireshark)
3. [HTTP Packets](#http-packets)
4. [SpotPass](#spotpass)
5. [High Priority Games](#high-priority-games)

<div class="tip red">
	<h2>Security Warning</h2>
	<strong>Network dumps will oftentimes have sensitive information, including emails, passwords, usernames, IP addresses, etc. Because of this, ensure you only provide network dumps to trusted individuals. When submitting network dumps to Pretendo Network developers your dumps are uploaded and stored in a private channel. This channel can only be accessed by a small number of people, not even all developers have access.</strong>
</div>

# Submissions
There are two ways to submit network dumps. You may either contact a developer directly, or use the `/upload-network-dump` command on our Discord server.

When submitting we ask that you do the following:

1. Perform as few actions as possible per session. Each session should be focussed on as few aspects of the game as possible to minimize "noise" (unrelated packets) which makes it difficult to decipher what is actually going on. For example, rather than uploading a session of playing random courses on Super Mario Maker it would be more helpful if the session was focussed on one part of the game, such as 100 Mario Challenge, starring a course, etc. That way it's clear exactly what the packets are doing in game.
2. When submitting, please provide a detailed description of what was done in the session. For example "Loaded course world and played a random course, starred the course and played a recommended course". This will add further context as to what the packets are doing in the dumps.
3. When submitting, please rename the dumps to something meaningful. Such as `played-and-starred-course-smm-jpn.pcap` rather than `did-something.pcap` or `12-20-23.pcap`. This does not apply to HokakuCafe BIN files, as they must remain named as they are. The file name of HokakuCafe BIN gives us important information regarding your session not found in the BIN data itself.

# Game Packets
Game packet dumps are the packets sent during a session to a game server. These packets are typically encrypted, so additional data will need to be submitted in order for us to decrypt them. There are several ways to dump these packets and the data needed to decrypt them.

### Wii U (HokakuCafe)
The easiest way to dump game server packets from a Wii U is to use [HokakuCafe](https://github.com/PretendoNetwork/HokakuCafe). This is an Aroma setup module which patches IOSU to write all network frames to a `.pcap` file on the SD card.

To use HokakuCafe download the [latest release](https://github.com/PretendoNetwork/HokakuCafe/releases/latest) setup module (`30_hokaku_cafe.rpx`). Place this file on the SD card at `wiiu/environments/[ENVIRONMENT]/modules/setup` and insert it back into the Wii U. Start your Wii U once, turn it off, and open the newly created `HokakuCafe/config.ini` file on the SD card. Set `Mode` to either `UDP` or `ALL`. At the time of writing, HokakuCafe has a bug where it will not dump all game packets when `Mode` is set to `PRUDP`. Insert the SD card back into the Wii U and all network traffic flowing through your console should be written to a PCAP.

The PCAP files are written to the `HokakuCafe` folder on the SD card, named as the date and time the session was started. HokakuCafe will also dump a BIN file, named `nexServiceToken-AAAAAAAAAA-BBBBBBBB.bin`. This file contains the data needed to decrypt the session packets, and MUST also be submitted. Otherwise the PCAP packets cannot be decrypted, and are of no use.

### 3DS (HokakuCTR)
The easiest way to dump game server packets from a 3DS is to use [HokakuCTR](https://github.com/PretendoNetwork/HokakuCTR). Like HokakuCafe this homebrew attempts to dump game traffic directly from the console. However unlike HokakuCafe, it does not dump all system traffic and may not work in all games. If HokakuCTR does not work in your game, see the last solution.

To use HokakuCTR, ensure you are updated to the latest Luma release. The latest Luma release now supports 3GX plugins. Download the [latest release](https://github.com/PretendoNetwork/HokakuCTR/releases/latest). Place this file on the SD card at `luma/plugins` and rename it `default.3gx`.

When launching a game you will see 1 of 2 notifications on screen. You will either see `Not Ready` or `Ready`. If you see `Not Ready`, your game is not compatible. If you see `Ready`, your game is compatible but has not necessarily started sending data. If you see nothing, either your game is not compatible, the plugin loader is disabled or the plugin is not installed. You can check if the plugin loader is disabled by opening the Rosalina menu (L + D-Pad down + Select) and ensure the "Plugin Loader" option is enabled. If your game is compatible, it will start dumping game traffic to a PCAP file once the game has connected to the server and begun sending data. You will know the game has connected to the server when you see either `Detected NEX buffer type: V0` or `Detected NEX buffer type: V1` on screen. These notifications indicate that the game has begun sending data. If you do not see one of these notifications, no data will be in your dump.

The PCAP is written to the SD card located at `HokakuCTR/[GAME NAME]`. HokakuCTR dumps are already decrypted, no additional data is required to decrypt them. They may be submitted as-is.

### All (WireShark)
If neither solution above works, the only option you have is to capture the traffic manually off the console. This is easiest done with WireShark and a hosted Wi-Fi access point. Create a hosted wifi access point on your PC which has WireShark installed and select that access point's interface in WireShark. Connect the console to this hosted access point, and you should begin to see all the network traffic from your console in WireShark. In order to both create a hosted access point and keep your PC online, you must have 2 ways of connecting to the internet on the PC. This is easiest done by using a USB Wi-Fi adapter to host the access point, and using ethernet to remain online. Not all USB Wi-Fi adapters support hosting access points. Ensure the one you use does. [This adapter](https://www.amazon.com/dp/B07C9TYDR4) is relatively cheap and supports hosting access points.

Just like with HokakuCafe, traffic dumped with WireShark will be encrypted. In order to decrypt the traffic, your NEX account username and password must also be submitted. Your NEX account has no relation to any other account, such as your NNID, and cannot be used to gain any information about you. It can, however, allow someone to log into game servers as you. Ensure you only provide these details to trusted individuals.

- 3DS - To dump your NEX username and password from a 3DS download and run [this homebrew application](https://9net.org/~stary/get_3ds_pid_password.3dsx). This will create a file on your SD card named `nex-keys.txt` with your NEX username and password. Copy and paste the contents of this file into the message of your submission.
- Wii U - To dump your NEX username and password from a Wii U connect to your Wii U with an FTP client. Navigate to `/storage_mlc/usr/save/system/act` and download all the folders inside this folder. Check the `account.dat` file in each folder and look for your NNID username in the `AccountId` field. Once found, in the same `account.dat` file locate both the `PrincipalId` and `NfsPassword` fields. `PrincipalId` is your NEX username (PID), and `NfsPassword` is your NEX password.

# HTTP Packets
Some games use HTTP requests for some features. Additionally, non-game titles will often use HTTP requests for their services. SpotPass data is also downloaded via HTTP requests. The above methods will not always capture HTTP requests in a way that is usable, if at all. For this, an HTTP proxy server is required. There are several options for HTTP proxy servers, however the simplest way is using our [mitmproxy Docker container](https://github.com/PretendoNetwork/mitmproxy-nintendo).

Full credit to the upkeep of the repository, and creation of the original Docker container, goes to GitHub user [MatthewL246](https://github.com/MatthewL246).

<div class="tip">
	<h2>Using a Raspberry Pi?</h2>
	<strong>Only 64 bit operating systems are supported. If using a Raspberry Pi, ensure you are using a 64 bit variant of your OS.</strong>
</div>

Install Docker for your operating system using the official [setup guide](https://docs.docker.com/get-docker/). If installing on Windows, you ***MUST*** use the WSL backend option. Then follow the steps for your console type.

## 3DS
1. Download [this IPS patch](https://github.com/PretendoNetwork/mitmproxy-nintendo/raw/master/ssl-patches/0004013000002F02.ips). This IPS patch patches the SSL sysmodule to disable SSL verification, allowing the console to connect to the proxy server with TLS connections.
2. Place the patch on your SD card at `SD:/luma/sysmodules/0004013000002F02.ips`.
3. Place the SD card back into your 3DS.
4. Launch into the Luma settings by holding `SELECT` while powering on.
5. Ensure both `Enable loading external FIRMS and modules` and `Enable game patching` are enabled before booting.
6. Launch Nimbus and connect to Nintendo Network.
7. On your computer, open a command prompt and run the following commands:
8. `mkdir 3ds-dumps`
9. `docker run -it --rm -p 8083:8083 -v ./3ds-dumps:/home/mitmproxy/dumps ghcr.io/pretendonetwork/mitmproxy-nintendo:3ds mitmdump`
	- If using Windows, run `wsl docker run -it --rm -p 8083:8083 -v ./3ds-dumps:/home/mitmproxy/dumps ghcr.io/pretendonetwork/mitmproxy-nintendo:3ds mitmdump`
10. These commands create a directory to store the sessions dumps, and starts the proxy server using Docker, exposing the servers port 8083 on your computers port also on 8083, and links the `/home/mitmproxy/dumps` directory in the container to the `3ds-dumps` directory you just created.
11. On your 3DS, launch into Internet Settings and select your connection.
12. Select `Change Settings > Proxy Settings`.
13. Select `Yes` and then `Detailed Setup`.
14. Enter your computers local IP address into `Proxy Server` and 8083 into `Port`.
15. Select `Ok` then `Save` and run the connection test. Your 3DS should connect to the internet and you should see connections being made in the proxy server
16. See the end of this section for final steps.

## Wii U
1. Download [this Aroma setup module](https://github.com/PretendoNetwork/mitmproxy-nintendo/raw/master/ssl-patches/30_nossl.rpx). This patches the SSL sysmodule to disable SSL verification, allowing the console to connect to the proxy server with TLS connections.
2. Place the patch on your SD card at `SD:/wiiu/environments/aroma/modules/setup/30_nossl.rpx`. If there are other patches with the same ID `30`, this is fine.
3. Place the SD card back into your Wii U and turn on the console.
4. Launch into the Aroma settings by pressing `L + DPAD-DOWN + SELECT`.
5. Enter `Inkay > Patching` and toggle `Connect to the Pretendo Network` to ***FALSE***.
6. On your computer, open a command prompt and run the following commands:
7. `mkdir wiiu-dumps`
8. `docker run -it --rm -p 8082:8082 -v ./wiiu-dumps:/home/mitmproxy/dumps ghcr.io/pretendonetwork/mitmproxy-nintendo:wiiu mitmdump`
	- If using Windows, run `wsl docker run -it --rm -p 8082:8082 -v ./wiiu-dumps:/home/mitmproxy/dumps ghcr.io/pretendonetwork/mitmproxy-nintendo:wiiu mitmdump`
9. These commands create a directory to store the sessions dumps, and starts the proxy server using Docker, exposing the servers port 8082 on your computers port also on 8082, and links the `/home/mitmproxy/dumps` directory in the container to the `wiiu-dumps` directory you just created.
10. On your Wii U, launch into `System Settings > Internet > Connect to the Internet > Connections` and select your connection.
11. Select `Change Settings > Proxy Settings`.
12. Select `Set` and `OK`.
13. Enter your computers local IP address into `Proxy Server` and 8082 into `Port`.
14. Select `Confirm`, `Don't Use`, then `Save` and run the connection test. Your Wii U should connect to the internet and you should see connections being made in the proxy server
15. See the end of this section for final steps.

## Final Steps
Once you have the proxy server running and your console connected to it, use the console as normal. When you are finished capturing a session, press `CTRL` and `C` in the command prompt running the proxy server to end the session. Ending a session will create a `wiiu-dumps/wiiu-latest.har` file or `3ds-dumps/3ds-latest.har` file depending on which console was used for the session. These files will be overwritten at the start of each new session, so they must be backed up or renamed to avoid losing their data.

For advanced usage of the proxy server, see https://github.com/PretendoNetwork/mitmproxy-nintendo

# SpotPass
SpotPass data, also called BOSS content, is sent using HTTP. The easiest way to submit SpotPass information to us is by dumping your consoles BOSS database. These databases contain SpotPass information for all games which you have enabled SpotPass for. This will give us the data needed to archive SpotPass content ourselves. Alternatively, you may submit [HTTP network dumps](#http-packets). Submitting HTTP network dumps gives us the SpotPass content as well, but requires more work on users.

For a list of games which use SpotPass content and still need to be archived, see [this spreadsheet](https://docs.google.com/spreadsheets/d/1qU0o7zxILAZcI83nOidr1QSrM0maVp6OGdBqg0xwul0/edit?usp=sharing).

<div class="tip">
	<strong>This spreadsheet was generated automatically. It may be incomplete and missing games or regions. Even if your game is not on this list we encourage you to upload HTTP dumps of it.</strong>
</div>

SpotPass content is region specific, so dumps of one games region may not work for a games other regions. All of a games regions must be checked and archived.

If you are uploading HTTP network dumps, please include the name of the game and it's region in your description.

If you are uploading your BOSS database, ensure your game has registered your BOSS tasks. Typically a game will register all of it's tasks once SpotPass is enabled for the game. A game may require you to be online before asking to enable SpotPass, but this depends on the game.

We encourage everyone to upload their task databases, even if you have not been online in a long time. These databases may contain SpotPass information from games you have played in the past.

## Wii U
The Wii U stores a separate database of BOSS tasks per user. Each one must be dumped and submitted individually.

1. Connect to the Wii U using [FTP](https://wiki.hacks.guide/wiki/Wii_U:FTP#Aroma-0).
2. Navigate to `/storage_mlc/usr/save/system/boss`.
3. Copy all the folders in this directory to your PC.
4. Submit the `task.db` file in each folder using Bandwidth.

## 3DS
The 3DS stores BOSS tasks in a single partition in the BOSS sysmodule.

1. Launch [GodMode9](https://github.com/d0k3/GodMode9).
2. Navigate to `SYSNAND CTRNAND > data > longstring > sysdata > 00010034`.
3. Select `00000000`. If your file is not named `00000000` you may still continue, though we cannot guarantee this is the correct file. If you have more than one file, repeat the following steps for each.
4. Select `Mount as DISA image`.
5. Press `A` to mount and enter the image.
6. Select `partitionA.bin`. If your file is not named `partitionA.bin` you may still continue, though we cannot guarantee this is the correct file. If you have more than one file, repeat the following steps for each.
7. Select `Copy to 0:/gm9/out`.
8. Turn off your console and eject the SD card.
9. Open your SD card on your computer.
10. Submit the partition BIN file using Bandwidth.

# High Priority Games
While all games are important to capture dumps for, this is a list of games we have identified as being high priority. All games on Nintendo Network share a common set of protocols used to implement the games online features, making it easy to use work from one game on many others. However these games have game-specific patches to their protocols, or even entirely custom ones, making this much harder to work with, especially after the official servers go down. Dumps for these games are considered high priority, but they should not be the only games dumped for. All games are important.

## 3DS
- `Animal Crossing - Happy Home Designer`
- `Daigassou! Band Brothers P (Japan)`
- `Kid Icarus: Uprising`
- `Miitopia`
- `Monster Hunter Generations`
- `Nintendo Badge Arcade`
- `Pokemon Omega Ruby / Alpha Sapphire`
- `Pokemon Rumble World`
- `Pokemon Sun / Moon`
- `Pokemon Ultra Sun / Ultra Moon`
- `Pokemon X / Y`
- `Real Dasshutsu Game x Nintendo 3DS - Chou Hakai Keikaku kara no Dasshutsu (Japan)`
- `Super Mario Maker for Nintendo 3DS`
- `Super Smash Bros for Nintendo 3DS`
- `Yakuman Houou Mahjong (Japan)`

## Wii U
- `MARIO KART 8`
- `MONSTER HUNTER 3 ULTIMATE Packet Relay...for Nintendo 3DS`
- `MONSTER HUNTER 3(tri-)G HD Ver.`
- `SUPER MARIO 3D WORLD`
- `Splatoon` (All Splatoon games likely have the same patches)
- `Splatoon (Demo)`
- `Splatoon Global Testfire`
- `Splatoon Pre-Launch Review`
- `Splatoon Testfire`
- `Super Mario Maker`
- `Super Smash Bros. for Wii U`
- `Wii KARAOKE U by JOYSOUND`
- `Wii Sports Club`
- `Wii Sports Club Lite`
- `Nintendo×JOYSOUND Wii カラオケ U`
- `Xenoblade Chronicles X`
- `役満 鳳凰`
