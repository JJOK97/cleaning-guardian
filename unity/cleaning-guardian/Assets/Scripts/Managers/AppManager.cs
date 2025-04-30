using UnityEngine;
using UnityEngine.SceneManagement;

public class AppManager : MonoBehaviour
{
    private void Start()
    {
        Debug.Log("[Init] AppManager 시작");

        // 간단한 네트워크 시뮬레이션 or 지연
        Invoke("LoadLobbyScene", 2f);
    }

    private void LoadLobbyScene()
    {
        Debug.Log("[Init] Lobby로 이동");
        SceneManager.LoadScene("Lobby");
    }
}