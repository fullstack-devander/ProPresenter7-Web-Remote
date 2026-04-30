using Microsoft.Extensions.Logging;
using ProPresenter7WEB.DesktopApplication.Properties;
using System.Threading.Tasks;

namespace ProPresenter7WEB.DesktopApplication.ViewModels
{
    public class MainWindowViewModel : ViewModelBase
    {
        private readonly ILogger _logger;

        private bool _isServerRunning;
        private string _startServerButtonText = MainWindowResources.StartServerButtonText;

        public MainWindowViewModel(ILogger<MainWindowViewModel> logger)
        {
            _logger = logger;
        }

        public string ProPresenterSettingsTitle => MainWindowResources.ProPresenterSettingsTitle;

        public string WebServerTitle => MainWindowResources.WebServerTitle;

        public string StartServerButtonText
        {
            get => _startServerButtonText;
            set
            {
                if (_startServerButtonText != value)
                {
                    _startServerButtonText = value;
                    OnPropertyChanged(nameof(StartServerButtonText));
                }
            }
        }

        public bool IsServerRunning
        {
            get => _isServerRunning;
            set
            {
                if (_isServerRunning != value)
                {
                    _isServerRunning = value;
                    OnPropertyChanged(nameof(IsServerRunning));
                    OnPropertyChanged(nameof(ServerStatus));
                }
            }
        }

        public string ServerStatus => _isServerRunning 
            ? MainWindowResources.ServerStatusRunning 
            : MainWindowResources.ServerStatusStopped;

        public async Task OnClickStartButton()
        {
            if (!_isServerRunning)
            {
                await StartServer();
            }
            else
            {
                await StopServer();
            }
        }

        private async Task StartServer()
        {
            if (App.WebApplication != null)
            {
                await App.WebApplication.StartAsync();

                IsServerRunning = true;
                StartServerButtonText = MainWindowResources.StopServerButtonText;

                _logger.LogInformation("Web Server is started.");
            }
            else
            {
                _logger.LogWarning("Cannot start Web Server because WebApplication is not built.");
            }
        }

        private async Task StopServer()
        {
            if (App.WebApplication != null)
            {
                await App.WebApplication.StopAsync();
                await App.WebApplication.DisposeAsync();
                IsServerRunning = false;

                StartServerButtonText = MainWindowResources.StartServerButtonText;

                _logger.LogInformation("Web Server is stopped.");
            }
            else
            {
                _logger.LogWarning("Web Server cannot be stopped because WebApplication is missed.");
            }
        }
    }
}
