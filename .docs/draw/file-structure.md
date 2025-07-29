autocad-web-app/
├── libs/
│   ├── db/                          # Database layer (IndexedDB)
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── database.ts      # Main database class
│   │   │   │   ├── schema.ts        # Database schema definition
│   │   │   │   ├── migrations.ts    # Schema migrations
│   │   │   │   ├── repositories/    # Data access layer
│   │   │   │   │   ├── base.repository.ts
│   │   │   │   │   ├── project.repository.ts
│   │   │   │   │   ├── material.repository.ts
│   │   │   │   │   ├── element-group.repository.ts
│   │   │   │   │   ├── element-subgroup.repository.ts
│   │   │   │   │   ├── subgroup-material.repository.ts
│   │   │   │   │   ├── cad-element.repository.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── services/        # Business logic services
│   │   │   │   │   ├── material-calculator.service.ts
│   │   │   │   │   ├── quantity-calculator.service.ts
│   │   │   │   │   ├── import-export.service.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── utils/
│   │   │   │   │   ├── indexeddb-utils.ts
│   │   │   │   │   ├── geometry-utils.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── project.json
│   │   └── package.json
│   │
│   ├── models/                      # TypeScript interfaces and types
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── entities/        # Core entities
│   │   │   │   │   ├── project.model.ts
│   │   │   │   │   ├── material.model.ts
│   │   │   │   │   ├── element-group.model.ts
│   │   │   │   │   ├── element-subgroup.model.ts
│   │   │   │   │   ├── subgroup-material.model.ts
│   │   │   │   │   ├── cad-element.model.ts
│   │   │   │   │   ├── sync-log.model.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── enums/           # Enumerations
│   │   │   │   │   ├── element-type.enum.ts
│   │   │   │   │   ├── unit-type.enum.ts
│   │   │   │   │   ├── sync-status.enum.ts
│   │   │   │   │   ├── material-category.enum.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── interfaces/      # Additional interfaces
│   │   │   │   │   ├── geometry.interface.ts
│   │   │   │   │   ├── material-quantity.interface.ts
│   │   │   │   │   ├── repository.interface.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── dto/             # Data transfer objects
│   │   │   │   │   ├── create-project.dto.ts
│   │   │   │   │   ├── update-project.dto.ts
│   │   │   │   │   ├── create-cad-element.dto.ts
│   │   │   │   │   ├── material-buildup.dto.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── validators/      # Validation schemas
│   │   │   │   │   ├── project.validator.ts
│   │   │   │   │   ├── material.validator.ts
│   │   │   │   │   ├── cad-element.validator.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── project.json
│   │   └── package.json
│   │
│   └── shared/                      # Shared utilities (future expansion)
│       ├── src/
│       │   ├── lib/
│       │   │   ├── constants/
│       │   │   │   ├── app.constants.ts
│       │   │   │   └── database.constants.ts
│       │   │   ├── utils/
│       │   │   │   ├── uuid.utils.ts
│       │   │   │   ├── date.utils.ts
│       │   │   │   └── validation.utils.ts
│       │   │   └── index.ts
│       │   └── index.ts
│       ├── project.json
│       └── package.json
│
├── apps/
│   └── web-app/                     # Main React application
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/      # React components
│       │   │   ├── hooks/           # Custom React hooks
│       │   │   ├── services/        # Frontend services
│       │   │   ├── stores/          # State management (Zustand/Redux)
│       │   │   └── App.tsx
│       │   ├── assets/
│       │   ├── main.tsx
│       │   └── styles/
│       ├── project.json
│       └── package.json
│
├── nx.json
├── package.json
├── tsconfig.base.json
└── README.md