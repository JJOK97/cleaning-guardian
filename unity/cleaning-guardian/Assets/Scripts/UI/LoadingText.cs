using DG.Tweening;
using TMPro;
using UnityEngine;

public class LoadingBlink : MonoBehaviour
{
    void Start()
    {
        TextMeshProUGUI text = GetComponent<TextMeshProUGUI>();
        text.DOFade(0f, 0.8f)
            .SetLoops(-1, LoopType.Yoyo);
    }
}
