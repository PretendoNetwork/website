# Using Pretendo (CEMU)
In this guide you will be able to use Pretendo on Cemu.
<div class="info-frame">ℹ️ Currently CEMU is the only Emulator that Pretendo supports at the moment.</div>



### What you need

`cemuhook.dil`  [Github](https://github.com/PretendoNetwork/cemu-patcher/releases)


# Instructions
Place the compiled `cemuhook.dll` in the same folder as Cemu. If patched correctly you will see an alert


## Using Pretendo with CemuHook by Rajkosto
<div class="info-frame yellow">⚠️ Due to loading issues with trying to load both CemuHook and cemu-patcher at the same time because of file names and DLL loading orders, cemu-patcher will search for a DLL named `true_cemuhook.dll` and inject it into the Cemu process if found. This is not officially supported by Rajkosto and may cause issues. Use at your own risk.</div>