# QwikCard

**No more awkward "Can you spell your Instagram handle?" moments.**

You know that moment. A person catches your interest during a gathering. Keeping contact feels like it should be simple. Instead, you’re digging through apps on your screen. Hunting down your profile link takes time. Saying your email out loud leads to mistakes when they enter it. That old habit of handing over paper cards? They vanish into pockets or end up crumpled in bins.

A fresh idea came to mind — something quick, online, maybe even practical.

# What is QwikCard?

A fresh way to share who you are online begins with QwikCard. This tool creates changeable QR codes on demand. Think of it as your full digital presence in one scan. It pulls together everything about you into a single, smart link.

A single QR code takes the place of five separate links. Scanned once, it leads straight to a tidy profile page, designed in dark tones. That page holds every link - like GitHub, LinkedIn, Twitter - all together. One scan does everything.

**The best part?** The “Save Contact” feature creates a `.vcf` file right away - tap once, add info straight into someone’s phone. That quick step skips typing, pulling data automatically instead.

---

## Key Features

* **Your Choice:** Whatever fits best - toss in phone, email, website, or skip some. Need LinkedIn? Drop it in. Got a GitHub? Works too. Change your mind later? Adjust anytime.
* **Smart Links:** Skip the full web address. Type `myname` only - the app knows how to turn that into a working Instagram link automatically.
* **One-Tap Save:** A single tap saves contact info automatically. Your details turn into a downloadable file behind the scenes. Scanning pulls everything straight from your profile.
* **UPI Ready:** A space just for UPI IDs now shows up. It helps freelancers get paid fast. Small business folks can grab payments without delay.
* **Custom Colors:** Your QR code lets you choose colors up front - swap out shades for both inside lines and backdrop to fit how your brand looks.
* **Privacy First:** Who scans your code? Nobody keeps tabs. This link connects only you and them - no middleman watching. Just straightforward sharing.

---

## Tech Stack

This runs on tools that catch errors early, move quickly, and work reliably - a stack chosen for clarity over trendiness.

**Backend**
* **FastAPI:** Speedy API routes start here. Performance stays sharp under load.
* **PostgreSQL (JSONB):** Storing contact details in a JSONB column lets me skip rigid table changes later. Need to include Discord next week? The structure adapts without requiring a migration.
* **SQLAlchemy:** ORM for database interactions.

**Frontend**
* **React + Vite:** Fresh on the user side. Speed feels light there. The browser handles it smoothly, right from launch.
* **React-QR-Code:** A fresh QR code appears each time. Graphics form instantly when needed, built right in the flow of things.
* **React-Hot-Toast:** Because browser pop-ups look bad.


# How to Run Locally

If you want to tweak the code or run it yourself:

1.  **Clone the repo**
    ```bash
    git clone [https://github.com/Jaiswal0507/qwikcard-project.git](https://github.com/Jaiswal0507/qwikcard-project.git)
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    pip install -r requirements.txt
    # Make sure you have a Postgres DB running and set DATABASE_URL in .env
    uvicorn main:app --reload
    ```

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---

# Future Improvements 

This is a passion project, so there's always room to grow. Here is what I'm planning next:
* [ ] User Accounts (Right now anyone can create a profile, but you can't "edit" it later without the link).
* [ ] Analytics (Count how many times your QR was scanned).
* [ ] NFC Support (Write the link to an NFC tag).

---

## Contributing

Found a bug? Want to add a "Snapchat" field? Feel free to open a PR. I appreciate any feedback!