using System;
using System.Threading.Tasks;
using Xunit;
using Amazon.Lambda.TestUtilities; 
using Blz.GetPresignedUrl; 

namespace Blz.IntegrationTests
{
    public class UploadLimitTests
    {
        [Fact]
        public async Task GuestUser_Exceeding50MB_ShouldThrowException()
        {
            // Arrange - A környezet és a "hacker" adatok előkészítése
            var function = new Function();
            var context = new TestLambdaContext(); 
            
            var hackerRequest = new UploadRequest
            {
                FileName = "hecker-film.mp4",
                FileSize = 60000000, // 60 MB
                UserId = "guest"     // Vendégként próbálkozik
            };

            
            var exception = await Assert.ThrowsAsync<Exception>(() => 
                function.FunctionHandler(hackerRequest, context)
            );


            Assert.Contains("Guest users are limited to 50 MB", exception.Message);
        }
    }
}