# Familia 3DS/2DS

<div class="tip red">
	<strong>¡PRECAUCIÓN!</strong>
	LAS TRANSFERENCIAS DE SISTEMA NO ESTÁN ACTUALMENTE SOPORTADAS POR NUESTROS SERVIDORES. INTENTAR REALIZAR UNA TRANSFERENCIA DE SISTEMA PUEDE EVITAR QUE PUEDAS CONECTARTE EN LÍNEA EN EL FUTURO. EL SOPORTE PARA LAS TRANSFERENCIAS DE SISTEMA ESTÁ EN DESARROLLO.
</div>

<div class="tip">
	ℹ️ Esta guía asume que tienes un <b>Sistema con Homebrew ejecutando la última versión de Luma3DS (13+)</b>. Si no es así, por favor sigue esta <a href="https://3ds.hacks.guide/" target="_blank">guía</a> para hacer Homebrew en tu sistema primero.
</div>

Los siguientes pasos son necesarios para que te puedas conectar a la Red Pretendo:
1. [Descargar Nimbus](#downloading-nimbus)
2. [Habilitar parches de Luma](#luma-patches)
3. [Nimbus](#using-nimbus)

## Descargar Nimbus

<div class="tip">
	ℹ️ Nimbus también está disponible en <a href="https://db.universal-team.net/3ds/nimbus" target="_blank">Universal-Updater</a>. Si no tienes Universal-Updater, puedes seguir esta <a href="https://universal-team.net/projects/universal-updater.html" target="_blank">guía</a>. Puedes descargar los archivos requeridos desde allí en lugar de GitHub, o instalar/actualizar la aplicación directamente desde tu consola.
	<br>
	<br>
	ℹ️ Si lo instalas directamente desde tu consola por primera vez, aún necesitarás instalar los parches IPS asociados desde GitHub. Una vez instalado, las actualizaciones pueden gestionarse exclusivamente desde Universal-Updater.
</div>

Antes de comenzar, apaga tu consola e inserta la tarjeta SD en tu computadora.

Una vez insertada, descarga la última versión de [Nimbus](https://github.com/PretendoNetwork/Nimbus/releases/latest).

Nimbus está disponible tanto como una aplicación 3DSX como un CIA instalable. La página de versiones ofrece descargas de ambas opciones. Selecciona la versión que prefieras utilizar, o selecciona el archivo `combined.[versión].zip` para utilizar ambos.

<img src="/assets/images/docs/install/3ds/zip-highlight.png" width=100% height=auto/>

Extrae el contenido del archivo zip a la raíz de tu tarjeta SD. Si se te pregunta si deseas fusionar o sobrescribir archivos, acepta los cambios.

Asegúrate de que tu tarjeta SD tenga todos los siguientes archivos:

- `SD:/luma/titles/000400300000BC02/code.ips` (Miiverse, JPN)
- `SD:/luma/titles/000400300000BD02/code.ips` (Miiverse, USA)
- `SD:/luma/titles/000400300000BE02/code.ips` (Miiverse, EUR)
- `SD:/luma/sysmodules/0004013000002F02.ips` (SSL)
- `SD:/luma/sysmodules/0004013000003202.ips` (FRD/Friends)
- `SD:/luma/sysmodules/0004013000003802.ips` (ACT/NNID)
- `SD:/3ds/juxt-prod.pem` (certificado de Juxtaposition)

Si no lo instalaste a través de Universal-Updater, asegúrate de que al menos uno de los siguientes también esté presente:

- `SD:/cias/nimbus.cia`
- `SD:/3ds/nimbus.3dsx`

Vuelve a insertar tu tarjeta SD en la consola.

## Parches de Luma

<div class="tip">
ℹ️ <b>Salta este paso si ya has habilitado los parches necesarios en tu consola para la Red Pretendo.</b>
</div>

Para usar el servicio de Red Pretendo, necesitarás habilitar los parches de Luma en tu consola. Mantén presionado el botón `SELECT` en tu 3DS y enciéndela.

En la pantalla que se muestra, asegúrate de que las siguientes opciones estén habilitadas:

- `Habilitar carga de firmwares y módulos externos`
- `Habilitar parcheo de juegos`

Presiona `START` para guardar y continuar con estos cambios.

## Instalación de Nimbus en el Menú HOME

<div class="tip">
ℹ️ <b>Salta este paso si solo descargaste el archivo zip de 3DSX.</b>
</div>

Si descargaste los archivos combinados o CIA, puedes instalar Nimbus en el Menú HOME para un acceso rápido y sencillo.

Abre FBI. Si no tienes FBI, descarga la última versión desde [GitHub](https://github.com/lifehackerhansol/FBI/releases/latest). Selecciona `SD`, luego `cias`. Encuentra y selecciona `nimbus.cia`. Selecciona `Instalar CIA` o `Instalar y eliminar CIA`.

Una vez que haya terminado la instalación, presiona el botón HOME y sal de FBI. Deberías ver un mensaje indicando que se ha añadido una nueva aplicación al Menú HOME. Haz clic en OK y ahora tendrás Nimbus en tu Menú HOME.

## Usando Nimbus

Dependiendo de cómo hayas instalado Nimbus, ábrelo a través del Homebrew Launcher o el Menú HOME de 3DS. Selecciona `Pretendo` o `Nintendo` para cambiar entre los servicios.

Tu selección persistirá entre reinicios.

## Iniciar sesión en tu PNID

El 3DS no depende de los NNID para la gran mayoría de los servidores de juegos. Debido a esto, el uso de un PNID tampoco es necesario para la mayoría de los juegos<sup><a>[[1]](#footnote-1)</a></sup>.

Configurar un PNID en el 3DS es similar a configurar un NNID. Puedes crear el PNID en tu consola o registrarlo desde una cuenta en [nuestro sitio web](/account/register) y vincularlo a tu consola en una fecha posterior.

Se recomienda registrar el PNID en tu dispositivo en este momento, ya que registrar en el sitio web actualmente no te permite cambiar tus datos de usuario.

## Otra información

### ¿Cómo funciona Nimbus?
Nimbus creará una segunda cuenta local establecida en el entorno `test` NASC. Los parches IPS establecerán que las URLs del entorno `test` NASC apunten a Pretendo. Puedes alternar libremente entre Pretendo y Nintendo. Tu modo seleccionado persistirá entre reinicios.

### ¿Segunda cuenta local?
Quizás te hayas preguntado: _"¿Segunda cuenta local? ¿Qué es eso? Pensé que la 3DS solo tenía una cuenta."_ Y estarías medio en lo correcto. La 3DS normalmente solo admite una cuenta, y solo puedes tener una cuenta activa a la vez. Sin embargo, Nintendo implementó soporte para múltiples cuentas locales en la 3DS/2DS que permanece sin usar en todas las unidades minoristas. En una unidad minorista normal, solo se crea una cuenta local, que se establece en el entorno `prod` NASC. Nimbus utiliza esta función no utilizada para crear cuentas locales en un entorno sandbox con diferentes entornos.

<ul id="footnotes">
	<li id="footnote-1"><sup>[1]</sup> Algunos juegos pueden requerir un PNID para ciertas acciones, como compras en eShop. El único juego conocido que requiere un PNID para uso general es Nintendo Badge Arcade, que aún no es compatible.</li>
</ul>
