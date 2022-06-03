import com.keysolutions.ddpclient.DDPClient;
import com.keysolutions.ddpclient.EmailAuth;
import com.keysolutions.ddpclient.TokenAuth;

import java.net.URISyntaxException;

public class TestClient {

    public static void main(String[] args) throws InterruptedException {
        DDPClient client;
        try {
            client = new DDPClient("192.168.4.1", 3000);
            DDPTestClientObserver obs = new DDPTestClientObserver();
            client.addObserver(obs);
            client.connect();
            Thread.sleep(500);
            System.out.println(obs.mDdpState + " to server");

            //  }]
            Object[] methodArgs = new Object[1];
            EmailAuth emailpass = new EmailAuth("meteorite@gmail.com", "password");
            methodArgs[0] = emailpass;
            int methodId = client.call("login", methodArgs, obs);
            System.out.println(methodId);
//        assertEquals(1, methodId);  // first ID should be 1

            // we should get a message back after a bit..make sure it's successful
            // we need to grab the "token" from the result for the next test
            Thread.sleep(500);
            String resumeToken = obs.mResumeToken;
            TokenAuth token = new TokenAuth(resumeToken);
            methodArgs[0] = token;
            methodId = client.call("login", methodArgs, obs);
            Thread.sleep(500);
            System.out.println(obs.mDdpState);
            int subId = client.subscribe("missions", new Object[] {}, obs);
            Thread.sleep(500);
            System.out.println(obs.mReadySubscription );
            client.call("addMission", new String[]{"Hiếu"});
            System.out.println(obs.mCollections.get("missions").size());
        } catch (URISyntaxException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
