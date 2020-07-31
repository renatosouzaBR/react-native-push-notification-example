## Objetivo do projeto

Recentemente precisei utilizar das Push Notifications com react-native, e comecei a estudar e testar algumas soluções, até que cheguei em uma versão funcionando. Aqui vou compartilhar quais pacotes utilizei e explicar o código desenvolvido para disparar notificações e também para verificar se existe uma atualização do aplicativo na loja.

### Bibliotecas

A biblioteca **react-native-push-notification** foi utilizada para disparar as notificações. Eu segui as etapas da documentação e deu tudo certo tanto para IOS e Android.

	https://github.com/zo0r/react-native-push-notification
	
A biblioteca **react-native-device-info** foi utilizado para pegar a versão do applicativo instalado.

	https://www.npmjs.com/package/react-native-device-info
	
A biblioteca **react-native-appstore-version-checker** foi utilizada para verificar a versão do aplicativos nas lojas Apple e Google.

	https://www.npmjs.com/package/react-native-appstore-version-checker
	
### Código

Agora que já falei das bibliotecas utilizadas, vou explicar resumidamente a organização e codificação do projeto.

Primeiramente eu criei uma pasta **src** e arrastei o arquivo **App.js** para dentro, e criei outro arquivo **PushNotificationConfig.js** que utilizei para configurar as notificações. Abaixo o código do **PushNotificationConfig**.

	import { Platform } from 'react-native';
	import PushNotificationIOS from '@react-native-community/push-notification-ios';
	import PushNotification from 'react-native-push-notification';
	
	PushNotification.configure({
	  // Quando você toca na notificação onNotification é disparado
	  onNotification: function (notification) {
	    console.log('onNotification:', notification);
	    notification.finish(PushNotificationIOS.FetchResult.NoData);
	  },
	
	  permissions: {
	    alert: true,
	    badge: true,
	    sound: true,
	  },
	
	  popInitialNotification: true,
	  requestPermissions: Platform.OS === 'ios',
	});
	
	export default PushNotification;
	
No arquivo **App.js** eu codifiquei a parte visual e ações. Segue o código.

	import React from 'react';
	import { View, Button, Platform } from 'react-native';
	
	import { getAppstoreAppMetadata } from 'react-native-appstore-version-checker';
	import DeviceInfo from 'react-native-device-info';
	import PushNotification from './PushNotificationConfig';
	
	const App = () => {
	  // Aqui eu disparo uma notificação local
	  const dispatchNotification = (title, message) => {
	    PushNotification.localNotification({ title, message, invokeApp: false });
	  };
	
	  // Aqui eu comparo a versão do meu app com um app da loja
	  // e se caso a versão da loja for diferente, eu disparo uma
	  // notificação avisando que tem atualização
	  const compareVersion = async () => {
	    try {
	      const id = Platform.OS === 'ios' ? '' : 'com.comprovaapp';
	      const metadata = await getAppstoreAppMetadata(id);
	
	      if (metadata.version !== DeviceInfo.getVersion())
	        dispatchNotification(
	          'Atualização',
	          'Existe uma nova versão do seu app. Pressione aqui para ir para a loja',
	        );
	    } catch (error) {
	      console.log('error occurred', error);
	    }
	  };
	
	  return (
	    <View style={{ flex: 1, justifyContent: 'center' }}>
	      <Button
	        title="Disparar Notificação"
	        onPress={() => dispatchNotification('Atenção', 'Abra o app')}
	      />
	      <Button title="Verificar nova versão do App" onPress={compareVersion} />
	    </View>
	  );
	};
	
	export default App;
	
Eu criei o método **dispatchNotification** para disparar as notificações, que eu importo de **PushNotificationConfig.js**, arquivo de configuração que eu exportei. 

Outro método **compareVersion** faz a verificação da versão do app na loja e compara se é diferente da versão local, e caso for, disparada uma notificação.

Na parte visual eu criei dois botões para disparar os 2 métodos criados.

**Bom. Isso é tudo. Se você tiver qualquer dúvida, pode entrar em contato que eu tento sanar.**