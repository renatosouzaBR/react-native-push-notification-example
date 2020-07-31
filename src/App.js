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
