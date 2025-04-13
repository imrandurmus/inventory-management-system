// src/main/java/group15/backend/dto/InvoiceDetailsDTO.java
package group15.backend.dto;

import java.util.List;

public class InvoiceDetailsDTO extends InvoiceDTO {
    private List<ItemDTO> items;

    public List<ItemDTO> getItems() {
        return items;
    }

    public void setItems(List<ItemDTO> items) {
        this.items = items;
    }
}