using Xunit;
using Blz.FileClassifier;

namespace Blz.UnitTests;

public class FileClassifierTests
{
    [Theory]
    [InlineData("nyaralas.jpg", "IMAGE")]
    [InlineData("kutyus.PNG", "IMAGE")]          
    [InlineData("user123/dokumentum.pdf", "DOCUMENT")] 
    [InlineData("jegyzet.txt", "DOCUMENT")]
    [InlineData("vicces_video.mp4", "VIDEO")]
    [InlineData("ismeretlen.xyz", "OTHER")]     
    [InlineData("kiterjesztes_nelkuli_fajl", "OTHER")] 
    [InlineData("", "OTHER")]                   
    public void GetFileCategory_ShouldReturnCorrectCategory(string fileKey, string expectedCategory)
    {

        string result = Function.GetFileCategory(fileKey);

        Assert.Equal(expectedCategory, result);
    }
}