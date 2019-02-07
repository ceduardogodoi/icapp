# Impressora Condor App

A finalidade deste projeto é fazer impressão de cartazes nas Lojas Condor. Ele é composto por um App e por uma API responsável pela comunicação entre eles.

## Montagem do ambiente de desenvolvimento

### Instalar e configurar o React Native

Seguir os passos para instalação e configuração do [**React Native**](https://facebook.github.io/react-native/docs/getting-started) e suas dependências na seção ***Building Projects with Native Code***.

### Clonagem do Projeto

Clone o projeto utilizando o comando: `git clone ssh://git@gitlab.condor.com.br:8443/marketing/printer/impressao-cartaz-app.git`.

### Instalação do **node_modules**

1. Acesse o diretório do projeto com o comando `cd impressao-cartaz-app`.
2. Instale o **node_modules** utilizando o comando `npm i` e aguarde o término da instalação dos pacotes.

### Configuração do Emulador
Abra o *Android Studio* (instalado no passo **Instalar e configurar o React Native**), e, no canto superior direito, encontre e abra o *AVD Manager (Android Virtual Device Manager)*.

Crie um novo emulador com as configurações parecidas com a de um tablet da impressora **Samsung MultiXpress X4220RX** executando os seguintes passos:
1. Clique em **Create Virtual Device...**
2. Em **Category** selecione **Tablet**.
3. Selecione **10.1" WXGA (Tablet)**.
4. Clique em **Next**.
5. Clique em **x86 Images**.
6. Selecione **Jelly Bean** de **API Level 17** e **Target Android 4.2 (Google APIs)**.
7. Clique em **Next**.
8. Clique em **Finish**.
9. Verifique se o novo Emulador apareceu no **AVD Manager**, geralmente com o nome **10.1 WXGA (Tablet) API 17**, caso não tenha o renomeado.
10. Execute o emulador clicando em seu botão *Play* e aguarde até que o emulador inicie e carregue completamente.
11. Caso o emulador seja iniciado em *modo retrato* altere-o para o *modo paisagem* usando os botões de orientação do próprio emulador.

Obs.: O *modo paisagem* não é obrigatório, porém o App foi construido nesse modo, por ser direcionado a um tablet.

### Execução do App no Emulador
Para executar o App no Emulador é necessário abrir o *Terminal* ou *Prompt de Comando* no diretório raíz do projeto e utilizar o comando `react-native run-android`.

Alternativamente, no projeto existe um arquivo `.bat` para executar o App, basta utilizar o comando `run` no *Prompt* do **Windows**, ainda dentro deste mesmo diretório, que ele irá executar o mesmo comando citado acima.

Feito isso aguarde até que o App seja construído e suba no Emulador.

Obs.: Uma janela do **Node** é aberta ao executar o comando `react-native run-android`, não feche-a, ela é a ponte entre o **JavaScript** e o **Nativo**. Não feche também o *Terminal* ou *Prompt* que está executando comando.

Se tudo ocorreu corretamente, o App se abrirá no Emulador.

### Fazendo alterações no App

Todo o desenvolvimento é feito na pasta `src`.

Respeitando a estrutura já existente, com a seguintes pastas:

### Pasta `api`

Contém os arquivos/classes para acesso as APIs necessárias da aplicação. Este acesso utiliza o [Axios](https://github.com/axios/axios).

Sendo chamadas simples, apenas para centralizar os endereços, parâmetros e retornos das APIs.

### Pasta `components`

Pasta onde os componentes da aplicação são armazenados. Os componentes podem ser classes que estendem React.Component ou funções JavaScript.

### Pasta `constants`

Pasta contendo todas as actions que podem ser disparadas para o **Redux**.

### Pasta `containers`

Pasta contendo todos os componentes containers (componentes pai).

### Pasta `native_modules`

Pasta contendo todos os componentes que são features nativas (**Java**/**Swift** ou **Objective-C**) trazidas para o **React Native**.

### Pasta `reducers`

Pasta contendo os arquivos do [Redux](https://redux.js.org/) do projeto.
Mais precisamente os `reducers`, que controlam os estados e transferência de dados.

### Pasta `sagas`

Pasta contendo os arquivos do [Redux-Saga](https://redux-saga.js.org/) do projeto.

Arquivos estes, que controlam o funcionamento e comunicação entre os componentes e o **Redux**.

### Pasta `store`

Pasta contendo as configurações do **Redux Store**.

### Pasta `utils`

Pasta contendo vários tipos de utilitários.

### Arquivos da pasta `src`

Entre os arquivos da pasta `src` são utilizados principalmente para manter a estrutura do projeto.

Então a modificação deles deve acontecer de maneira controlada, sempre evitando criar novos arquivos na pasta.

Conteúdo da pasta `src`:
* android/ - Possui toda a estrutura de arquivos para o Android (o projeto Android Nativo)
* bin/ - Possui as apks Impressora Condor, SmartUXServices e o arquivo de instruções
* ios/ - Possui toda a estrutura de arquivos para o iOS (o projeto iOS Nativo)
* App.js - Componente principal da aplicação
* app.json - Definição de nomes do App para o React Native.
* index.js - Registra o componente principal do App.

### Debugando com o React Native

Assim como no **React**, também é possível fazer alterações no **React Native** com o aplicativo rodando (em tempo real), mas isso deve ser ativado utilizando o comando:

`adb shell input keyevent 82`

Uma janela se abrirá no Emulador, nela, selecione as opções:
* *Enable Live Reload*
* *Enable Hot Reloading*

Para utilizar o console, selecione a opção:
* *Debug JS Remotely*

Isso abrirá uma nova aba no seu navegador padrão com o endereço `http://10.0.2.2:8081/debugger-ui`. Altere o endereço para `http://localhost:8081/debugger-ui`. O primeiro endereço parece ser um bug.

Obs.: Caso o debugger fique na mesma aba em que existam outras abas abertas, o emulador reclamará que o debugger não está numa janela isolada. Para resolver, é necessário deixar o debugger em uma janela isolada com somente esta aba aberta.

Caso o debugger não apresente a mensagem:
```
Status: Debugger session #0 active.
```
Matenha o debugger aberto, feche a janela do **Node** e execute o App novamente.

### Erro ao tentar imprimir no Emulador

Ao tentar imprimir algum Documento usando o Emulador, o App irá dar *crash* e exibirá a mensagem:
> Unfortunately, Impressora Condor has stopped.

Isso acontece pois não é possível imprimir usando o Emulador desde que ele não possui os recursos da impressora.

Para previnir esse erro no Emulador basta comentar a seguinte linha do arquivo `src/js/sagas/sagas.js` (aproximadamente linha 107):
```
SmartUXSDKModule.executePrint(filePath); // Comentar essa linha
```

### Fazendo build do App

Antes de fazer o build do App é importante fechar a janela do **Node** para que nenhum arquivo reclame de estar sendo utilizado.

Para fazer o build e gerar o arquivo `.apk` (extensão para aplicativos Android), siga os seguintes passos:
1. Abra um *Terminal* ou *Prompt de Comando*
2. Entre na pasta android do projeto: `cd android`
3. Utilize o comando `gradlew assembleRelease` para fazer efetivamente o build
4. Aguarde até o fim da construção do App
5. Se tudo ocorrer corretamente a mensagem ``BUILD SUCCESSFUL`` será exibida.

O arquivo `.apk` será gerado no diretório `impressao-cartaz-app\android\app\build\outputs\apk\release` com o nome de `app-release.apk`.

Alternativamente, existe um script chamado `build.bat` no diretório raiz do projeto que irá fazer o build e copiar a `.apk` produzida para a Área de Trabalho do seu usuário no **Windows**.

Para instalar o App em uma impressora, siga os passos do arquivo `impressao-cartaz-app\bin\Leia-me.odt`.

### Ferramentas utilizadas

Front-end
* [Android Studio](https://developer.android.com/studio/)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Postman](https://www.getpostman.com/)
* [React Native Debugger Standalone](https://github.com/jhen0409/react-native-debugger)

Back-end
* [Spring Tool Suite](https://spring.io/tools)

# Impressora Condor App

**Descrição:** Impressão de Cartazes das Lojas Condor

**Redmine:** http://redmine.condor.com.br/issues/336

**Git - Front-end:** http://gitlab.condor.com.br/marketing/printer/impressao-cartaz-app

**Git - Back-end:** http://gitlab.condor.com.br/marketing/printer/impressao-cartaz-api

## Dependências

Este projeto tem como dependências as seguintes libs:
```
"axios": "^0.18.0",
"native-base": "^2.8.1",
"react": "16.6.0-alpha.8af6728",
"react-native": "^0.57.1",
"react-native-elements": "^0.19.1",
"react-native-size-matters": "^0.1.4",
"react-native-user-inactivity": "^0.1.3-next",
"react-native-vector-icons": "^6.0.2",
"react-navigation": "^2.18.1",
"react-navigation-header-buttons": "^2.1.0",
"react-redux": "^5.1.1",
"redux": "^4.0.1",
"redux-saga": "^0.16.2",
"rn-fetch-blob": "^0.10.13"
```

## Extras

Warning na dependência `rn-fetch-blob` ao executar ou fazer o build do app:
```
WARNING: Configuration 'compile' is obsolete and has been replaced with 'implementation' and 'api'.
It will be removed at the end of 2018. For more information see: http://d.android.com/r/tools/update-dependency-configurations.html
```

Para resolver este warning é necessário editar a linha 40 do arquivo `impressao-cartaz-app\node_modules\rn-fetch-blob\android\build.gradle` trocando de `compile` para `implementation`, ficando:
```
implementation "com.facebook.react:react-native:${safeExtGet('reactNativeVersion', '+')}"
```