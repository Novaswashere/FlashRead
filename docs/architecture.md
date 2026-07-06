# Architecture Documentation

## Overview
FlashRead is built using a hybrid architecture separating UI presentation, domain business layers, and deterministic speed reading calculation engines.

## Key Subsystems
- **RSVP Reading Engine**: Independent from React UI.
- **Parsing Subsystem**: Specialized parsers per document type.
- **Storage Subsystem**: Off-line indexing and content retrieval.
