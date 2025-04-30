public static class SceneLoader
{
    public static void LoadScene(string sceneName)
    {
        UnityEngine.SceneManagement.SceneManager.LoadScene(sceneName);
    }

    public static class Names
    {
        public const string Init = "Init";
        public const string Lobby = "Lobby";
        public const string Map = "Map";
        public const string Battle = "Battle";
        public const string Result = "Result";
    }
}
