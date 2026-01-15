const text = `Passionate Salesforce Developer crafting scalable, user-centric business solutions.
22× Superbadge Achiever • AI Associate Certified • Trailhead Double Star Ranger
Skilled in Apex, LWC, Flows, and Triggers | Administrator & Developer Roles
Expertise in Sales & Service Cloud, Integration, and Asynchronous Processing`;

  const typewriterElement = document.getElementById('typewriter');
  let index = 0;

  function typeWriter() {
    if (index < text.length) {
      typewriterElement.innerHTML += text.charAt(index);
      index++;
      setTimeout(typeWriter, 40); // adjust speed (ms) here
    }
  }

  window.onload = typeWriter; // start on page load