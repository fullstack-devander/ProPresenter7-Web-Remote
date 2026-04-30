using Avalonia.Data.Converters;
using Avalonia.Media;
using System;
using System.Globalization;

namespace ProPresenter7WEB.DesktopApplication.Converters
{
    public class BoolToColorConverter : IValueConverter
    {
        private readonly SolidColorBrush _trueColor = new SolidColorBrush(Colors.Green);
        private readonly SolidColorBrush _falseColor = new SolidColorBrush(Colors.Red);

        public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
        {
            if (value is bool isTrue)
            {
                return isTrue ? _trueColor : _falseColor;
            }

            return _falseColor;
        }

        public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
