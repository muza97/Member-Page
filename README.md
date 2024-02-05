

```mermaid
graph TD
    subgraph Frontend Applications
        FA1(ADMIN App 1)
        FA2(DRIVER App 2)
        FA3(CUSTOMER App 3)
        FA4(MEMBER App 4)
    
    end

    subgraph Backend Systems
        BE1[Backend System 1 - Authentication]
        BE2[Backend System 2 - Business Logic]
    end

    DB[(MongoDB Database)]

    FA1 -->|interacts with| BE1
    FA1 -->|interacts with| BE2
    FA2 -->|interacts with| BE1
    FA2 -->|interacts with| BE2
    FA3 -->|interacts with| BE1
    FA3 -->|interacts with| BE2
    FA4 -->|interacts with| BE1
    FA4 -->|interacts with| BE2
   

    BE1 -->|reads/writes to| DB
    BE2 -->|reads/writes to| DB