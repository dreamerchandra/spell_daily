Perfect — this is excellent reasoning and prioritization.
You’ve clarified exactly how the **scheduler’s reliability model** works — “eventually consistent within 5 minutes,” not “exactly once per reminder.”

Below is your refined spec rewritten as a **junior-facing task document** — clean, concise, and opinionated enough that they’ll have to think and ask good questions but won’t get stuck on design ambiguity.
It keeps your logic intact and emphasizes the reasoning behind each choice.

---

## 🧠 Task: Implement Reminder Scheduler Logic

### 🎯 Objective

Implement a Firebase-triggered function that runs every **5 minutes** and processes reminders from the Postgres `reminder` table.

It should:

- Fetch reminders that are due or past due (`!is_attended && is_active`).
- Make a POST request to a predefined URL in a given JSON format.
- Update database fields appropriately (attempt counts, timestamps, and attended status).

---

### 🗃️ Table Schema

**Table: `reminder`**

| Column            | Type       | Description                                 |
| ----------------- | ---------- | ------------------------------------------- |
| `user_id`         | UUID / INT | Owner of the reminder                       |
| `date_time`       | TIMESTAMP  | When the reminder is due                    |
| `message`         | TEXT       | Message content                             |
| `is_attended`     | BOOLEAN    | Whether it has been successfully processed  |
| `is_active`       | BOOLEAN    | Whether it’s still valid                    |
| `last_attempt_at` | TIMESTAMP  | Last time an attempt was made               |
| `attempt_count`   | INT        | How many times this reminder has been tried |

---

### 🕒 Scheduler Timing Model

- The Firebase Scheduler runs **every 5 minutes**.
- At each run (say at `10:30`), we fetch all reminders where:
  - `is_active = true`
  - `is_attended = false`
  - `date_time <= now()` (includes overdue ones)
  - and `attempt_count < 3`

> 💡 Example:
> If the user creates a reminder at 10:34, it will be picked up by the 10:35 run.
> We don’t need real-time triggering — the 5-minute delay is acceptable.

---

### ⚙️ Processing Flow

#### 1️⃣ Fetch Pending Reminders

Query reminders meeting the above conditions.

#### 2️⃣ For Each Reminder

Perform the following steps **transactionally**:

1. **Before making the request:**
   - Increment `attempt_count`
   - Update `last_attempt_at = now()`
   - Commit this transaction immediately
     (so even if the function dies later, we know an attempt was made)

2. **Then make the POST request**
   - URL: predefined constant
   - JSON format (to be defined)
   - No retries inside the same run — next scheduler run will retry if still not attended

3. **After receiving the response:**
   - If status = 200 → `is_attended = true`
   - If not → leave as `false`
   - Update this asynchronously (no transaction lock at this stage)

---

### 🔄 Retry Logic

- Maximum 3 attempts per reminder (`attempt_count < 3`)
- Retried automatically by subsequent scheduler runs
- No exponential backoff — just “try every 5 minutes”
- Failed reminders beyond 3 attempts will remain unprocessed

---

### ⚡ Reliability Tradeoffs

- If the scheduler crashes midway, only some reminders may have been sent.
- That’s acceptable because correctness of **scheduling** (event getting picked up) is more important than **delivery success**.
- Each run should be idempotent — the same reminder shouldn’t get reprocessed once `is_attended = true`.

---

### 🧩 Notes

- Use UTC timestamps for all comparisons (`date_time <= now()`)
- No separate log table needed (function logger handles observability)
- Reminders older than 24h and still un-attended should not exist under normal operation

---

### 🧠 For You to Clarify (Ask Before Coding)

1. What’s the exact JSON format for the POST request payload?
   Example:

   ```json
   {
     "userId": "...",
     "message": "...",
     "dateTime": "2025-11-05T10:35:00Z"
   }
   ```

2. What’s the expected server response format (only status 200 checked or body content too)?
3. Should failed requests due to 4xx be retried or only 5xx/network errors?
4. Do we need to batch database updates or process one-by-one?

---

### ✅ Acceptance Criteria

- Function runs successfully via Firebase Scheduler every 5 min
- Correct reminders are picked (based on `is_attended`, `is_active`, `date_time`, `attempt_count`)
- Database updates happen in the correct order (transaction → API → update)
- No duplicate sends
- Works even if partially failed midway

---

Would you like me to add a **pseudocode + SQL sample** version to this doc (something you can directly paste into a PRD or Linear ticket)? It’ll include realistic Postgres queries and transaction structure matching your “update before request, async update after response” rule.
