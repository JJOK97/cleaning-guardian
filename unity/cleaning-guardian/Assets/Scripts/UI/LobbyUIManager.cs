using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class LobbyUIManager : MonoBehaviour
{
    [SerializeField] private Button startButton;
    [SerializeField] private Button settingsButton;

    private void Start()
    {
        startButton.onClick.AddListener(OnStartClicked);
        settingsButton.onClick.AddListener(OnSettingsClicked);
    }

    private void OnStartClicked()
    {
        Debug.Log("게임 시작 버튼 클릭됨");
        // TODO: 맵 씬으로 전환
        // SceneManager.LoadScene("Map");
    }

    private void OnSettingsClicked()
    {
        Debug.Log("설정 버튼 클릭됨");
        // TODO: 설정 팝업 열기
    }
}
