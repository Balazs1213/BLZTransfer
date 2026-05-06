using Xunit;
using Blz.TextractAnalyzer;
using Amazon.Textract.Model;
using System.Collections.Generic;

namespace Blz.UnitTests;

public class TextractAnalyzerTests
{
    [Theory]
    [InlineData("user-123/invoice.pdf", "user-123")]
    [InlineData("just-a-file.jpg", "guest")]
    [InlineData("", "guest")]
    public void ExtractUserId_ShouldReturnCorrectId(string key, string expected)
    {
        var result = Function.ExtractUserIdFromKey(key);
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ApplySafetyLimit_ShouldTruncateWhenOverLimit()
    {
        string longText = new string('a', 1100);
        bool wasTruncated;
        
        var result = Function.ApplySafetyLimit(longText, out wasTruncated);

        Assert.True(wasTruncated);
        Assert.Equal(1000, result.Length);
        Assert.Contains("[TRUNCATED]", result);
    }

    [Fact]
    public void BuildTextFromLineBlocks_ShouldCombineLinesOnly()
    {
        var blocks = new List<Block>
        {
            new Block { BlockType = "LINE", Text = "Hello" },
            new Block { BlockType = "WORD", Text = "World" }, 
            new Block { BlockType = "LINE", Text = "GitHub" }
        };

        var result = Function.BuildTextFromLineBlocks(blocks);

        Assert.Equal("Hello\nGitHub", result);
    }
}