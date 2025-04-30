using UnityEngine;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance;

    public int trashCleaned = 0;
    public int hp = 3;
    public float timeRemaining = 60f;

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    public void InitGameState()
    {
        trashCleaned = 0;
        hp = 3;
        timeRemaining = 60f;
    }
}
