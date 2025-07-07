const row1Images = [
      "https://cdn-icons-png.flaticon.com/128/2111/2111432.png", // Github
      "https://cdn-icons-png.flaticon.com/128/1051/1051277.png", // HTML
      "https://cdn-icons-png.flaticon.com/128/16020/16020753.png", // CSS
      "https://cdn-icons-png.flaticon.com/128/5968/5968292.png", // JavaScript
      "https://cdn-icons-png.flaticon.com/128/5968/5968322.png",   // Node
      "https://cdn-icons-png.flaticon.com/128/5968/5968350.png", // Python
      "https://cdn-icons-png.flaticon.com/128/5812/5812987.png", // G DEV
      "https://cdn-icons-png.flaticon.com/128/5136/5136932.png", // Commit Git
      "https://cdn-icons-png.flaticon.com/128/5968/5968853.png", // GII Lab
      "https://cdn-icons-png.flaticon.com/128/1034/1034504.png",   // HTTPS
      "https://cdn-icons-png.flaticon.com/128/15264/15264418.png",   // WEB PRO
      "https://cdn-icons-png.flaticon.com/128/15713/15713436.png", // visual studio code
      "https://cdn-icons-png.flaticon.com/128/1483/1483307.png", // Notepad
      "https://cdn-icons-png.flaticon.com/128/9818/9818292.png", // Trigger
      "https://cdn-icons-png.flaticon.com/128/14982/14982659.png",   // Api
      "https://cdn-icons-png.flaticon.com/128/2214/2214046.png",//lightning
      "https://cdn-icons-png.flaticon.com/128/5968/5968914.png", // Salesforce
      "https://cdn-icons-png.flaticon.com/128/2115/2115955.png",//Apex
      "https://cdn-icons-png.flaticon.com/128/16511/16511228.png",//LInux //----
      
    ];

    const row2Images = [
      "https://cdn-icons-png.flaticon.com/128/15474/15474894.png",//Einstein
      "https://cdn-icons-png.flaticon.com/128/12133/12133548.png",//AI//---
      "https://cdn-icons-png.flaticon.com/128/3102/3102352.png", // salescloud
      "https://cdn-icons-png.flaticon.com/128/18495/18495399.png", // commerce cloud
      "https://cdn-icons-png.flaticon.com/128/2655/2655776.png", // service cloud
      "https://cdn-icons-png.flaticon.com/128/13296/13296460.png", // exsperience cloud
      "https://cdn-icons-png.flaticon.com/128/18955/18955040.png",   // Skill
      "https://cdn-icons-png.flaticon.com/128/6604/6604820.png",   // postman
      "https://cdn-icons-png.flaticon.com/128/6797/6797002.png", // financial services cloud
      "https://cdn-icons-png.flaticon.com/128/1420/1420862.png", // Marketing cloud
      "https://cdn-icons-png.flaticon.com/128/2704/2704081.png", //educational cloud
      "https://cdn-icons-png.flaticon.com/128/3771/3771327.png", //App exchange
      "https://cdn-icons-png.flaticon.com/128/4661/4661361.png",//Time management
      "https://cdn-icons-png.flaticon.com/128/15552/15552476.png", //validation
      "https://cdn-icons-png.flaticon.com/128/1378/1378593.png", //Communication
      "https://cdn-icons-png.flaticon.com/128/3921/3921617.png",   // CRM
      "https://cdn-icons-png.flaticon.com/128/126/126327.png",//personality
      "https://cdn-icons-png.flaticon.com/128/7286/7286142.png", //Email
      "https://cdn-icons-png.flaticon.com/128/6352/6352833.png",   // BD
      "https://cdn-icons-png.flaticon.com/128/1535/1535019.png",//BD1
      "https://cdn-icons-png.flaticon.com/128/11358/11358928.png", // LEAD
    ];

    function populateMarquee(rowId, images) {
      const row = document.getElementById(rowId);
      for (let i = 0; i < 2; i++) {  // Duplicate images for seamless scroll
        images.forEach(src => {
          const img = document.createElement('img');
          img.src = src;
          img.className = 'img';
          row.appendChild(img);
        });
      }
    }

    populateMarquee('row1', row1Images);
    populateMarquee('row2', row2Images);