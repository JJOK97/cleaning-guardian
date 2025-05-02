using UnityEngine;
using UnityEngine.UI;
using TMPro;
using UnityEngine.SceneManagement;

public class MapUIManager : MonoBehaviour
{
    [Header("상단 UI")]
    [SerializeField] private TMP_Text nicknameText;
    [SerializeField] private TMP_Text goldText;
    [SerializeField] private TMP_Text energyText;
    [SerializeField] private Button settingsButton;
    [SerializeField] private Button inviteButton;

    [Header("지역 UI")]
    [SerializeField] private TMP_Text regionNameText;
    [SerializeField] private TMP_Text pollutionLevelText;

    [Header("스테이지 버튼")]
    [SerializeField] private Button[] stageButtons;

    [Header("좌우 전환")]
    [SerializeField] private Button leftArrowButton;
    [SerializeField] private Button rightArrowButton;

    [Header("하단 탭")]
    [SerializeField] private Button rankingButton;
    [SerializeField] private Button shopButton;
    [SerializeField] private Button encyclopediaButton;
    [SerializeField] private Button inventoryButton;

    private void Start()
    {
        // 상단 버튼
        settingsButton.onClick.AddListener(OnClickSettings);
        inviteButton.onClick.AddListener(OnClickInvite);

        // 스테이지 버튼들
        for (int i = 0; i < stageButtons.Length; i++)
        {
            int stageIndex = i + 1;
            stageButtons[i].onClick.AddListener(() => OnClickStage(stageIndex));
        }

        // 지역 전환
        leftArrowButton.onClick.AddListener(OnClickPrevRegion);
        rightArrowButton.onClick.AddListener(OnClickNextRegion);

        // 하단 탭
        rankingButton.onClick.AddListener(() => SceneLoader.LoadScene(SceneLoader.Names.Ranking));
        shopButton.onClick.AddListener(() => SceneLoader.LoadScene(SceneLoader.Names.Shop));
        encyclopediaButton.onClick.AddListener(() => SceneLoader.LoadScene(SceneLoader.Names.Encyclopedia));
        inventoryButton.onClick.AddListener(() => SceneLoader.LoadScene(SceneLoader.Names.Inventory));
    }

    private void OnClickSettings()
    {
        Debug.Log("설정 열기");
        // 설정 팝업 띄우기
    }

    private void OnClickInvite()
    {
        Debug.Log("친구 초대하기");
        // 공유 시스템 호출
    }

    private void OnClickStage(int stageNumber)
    {
        Debug.Log($"스테이지 {stageNumber} 진입");
        SceneManager.LoadScene("GameReadyScene");
    }

    private void OnClickPrevRegion()
    {
        Debug.Log("이전 지역 보기");
        // 데이터 바인딩 바꿔치기
    }

    private void OnClickNextRegion()
    {
        Debug.Log("다음 지역 보기");
        // 데이터 바인딩 바꿔치기
    }
}
