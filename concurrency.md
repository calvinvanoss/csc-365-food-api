# Concurrency Control Mechanisms

### Case 1: Dirty Read Phenomenon
**Scenario**: In the make_purchase function, a user initiates a purchase transaction, 
which involves reading the current balance from the accounts table and deducting the book cost from the balance. 
However, another transaction may read the same balance before the deduction, 
leading to a dirty read if the first transaction is rolled back.

### Case 2: Non-Repeatable Read Phenomenon:

### Case 3: Phantom Read Phenomenon:
