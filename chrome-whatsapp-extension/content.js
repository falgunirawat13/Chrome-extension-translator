console.log("WhatsApp Translator content script loaded!");

// Function to reverse text
function reverseText(text) {
  return text.split("").reverse().join(""); // Reverse the text
}

// Check if the script is getting the saved languages from storage
chrome.storage.sync.get(
  ["inputLang", "outputLang"],
  ({ inputLang, outputLang }) => {
    console.log("Input language:", inputLang, "Output language:", outputLang);

    if (!inputLang || !outputLang) {
      console.warn(
        "Languages not set. Please set input and output languages from the extension popup."
      );
      return;
    }

    // Function to observe mutations in the chat container
    const observeChatContainer = (chatContainer) => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.querySelector("span[dir='ltr']")) {
              const messageNode = node.querySelector("span[dir='ltr']");
              const originalMessage = messageNode.textContent;

              if (originalMessage) {
                console.log("Original message:", originalMessage);
                // Reverse the message instead of translating
                const reversedMessage = reverseText(originalMessage);
                console.log("Reversed message:", reversedMessage);
                messageNode.textContent = reversedMessage;
              }
            }
          });
        });
      });

      observer.observe(chatContainer, { childList: true, subtree: true });
    };

    // Poll for the chat container until it's available
    const pollForChatContainer = setInterval(() => {
      const chatContainer = document.querySelector("#main");
      if (chatContainer) {
        console.log("Chat container found.");
        clearInterval(pollForChatContainer); // Stop polling once the container is found
        observeChatContainer(chatContainer);
      } else {
        console.log("Chat container not found yet.");
      }
    }, 1000); // Poll every second

    // Function to handle message input reversal
    const handleMessageInput = (messageInput) => {
      messageInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault(); // Prevent default send action
          const originalText = messageInput.innerText;

          if (originalText.trim()) {
            console.log("Original input text:", originalText);
            // Reverse the message before sending
            const reversedText = reverseText(originalText);
            console.log("Reversed input text:", reversedText);
            messageInput.innerText = reversedText;

            // Send the reversed message
            event.target.dispatchEvent(
              new KeyboardEvent("keydown", { key: "Enter" })
            );
          }
        }
      });
    };

    // Poll for the message input field until it's available
    const pollForMessageInput = setInterval(() => {
      const messageInput = document.querySelector('[contenteditable="true"]');
      if (messageInput) {
        console.log("Message input found.");
        clearInterval(pollForMessageInput); // Stop polling once the input field is found
        handleMessageInput(messageInput);
      } else {
        console.log("Message input not found yet.");
      }
    }, 1000); // Poll every second
  }
);
