using UnityEngine;
using UnityEngine.SceneManagement;

public class AppManager : MonoBehaviour
{
    private void Start()
    {
        Debug.Log("[Init] AppManager 시작");

        Invoke("LoadLobbyScene", 2f);
    }

    private void LoadLobbyScene()
    {
        Debug.Log("[Init] Lobby로 이동");
        SceneManager.LoadScene("Lobby");
    }
}
