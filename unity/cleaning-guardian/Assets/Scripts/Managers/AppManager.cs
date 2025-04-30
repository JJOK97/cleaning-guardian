using UnityEngine;
using UnityEngine.SceneManagement;

public class AppManager : MonoBehaviour
{
    private void Start()
    {
        Debug.Log("[Init] AppManager ����");

        Invoke("LoadLobbyScene", 2f);
    }

    private void LoadLobbyScene()
    {
        Debug.Log("[Init] Lobby�� �̵�");
        SceneManager.LoadScene("Lobby");
    }
}
