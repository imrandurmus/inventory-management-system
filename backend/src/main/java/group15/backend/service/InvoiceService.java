// src/main/java/group15/backend/service/InvoiceService.java
package group15.backend.service;

import group15.backend.dto.InvoiceDTO;
import group15.backend.dto.InvoiceDetailsDTO;
import group15.backend.dto.ItemDTO;
import group15.backend.model.Invoice;
import group15.backend.model.Order;
import group15.backend.model.OrderItem;
import group15.backend.repository.InvoiceRepository;
import group15.backend.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvoiceService {
    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private OrderRepository orderRepository;

    public Page<InvoiceDTO> getInvoices(Pageable pageable) {
        return invoiceRepository.findAll(pageable).map(this::toDTO);
    }

    public InvoiceDetailsDTO getInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Invoice not found"));
        InvoiceDetailsDTO dto = new InvoiceDetailsDTO();
        dto.setId(invoice.getId());
        dto.setOrderId(invoice.getOrderId());
        dto.setCustomerName(invoice.getCustomerName());
        dto.setTotalAmount(invoice.getTotalAmount());
        dto.setDate(invoice.getDate().toString());

        // Fetch order items
        Order order = orderRepository.findById(invoice.getOrderId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        List<ItemDTO> items = order.getItems().stream()
                .map(item -> new ItemDTO(
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getProduct().getPrice().doubleValue(),
                        item.getProduct().getPrice().doubleValue() * item.getQuantity()
                ))
                .collect(Collectors.toList());
        dto.setItems(items);

        return dto;
    }

    public InvoiceDTO createInvoice(InvoiceDTO dto) {
        // Create corresponding order
        Order order = new Order();
        order.setCustomerName(dto.getCustomerName());
        order.setTotalPrice(new java.math.BigDecimal(dto.getTotalAmount()));
        order = orderRepository.save(order);

        Invoice invoice = new Invoice();
        invoice.setOrderId(order.getId());
        invoice.setCustomerName(dto.getCustomerName());
        invoice.setTotalAmount(dto.getTotalAmount());
        invoice.setDate(LocalDate.parse(dto.getDate()));
        invoice = invoiceRepository.save(invoice);

        return toDTO(invoice);
    }

    public void deleteInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Invoice not found"));
        // Optionally delete linked order
        orderRepository.deleteById(invoice.getOrderId());
        invoiceRepository.deleteById(id);
    }

    private InvoiceDTO toDTO(Invoice invoice) {
        InvoiceDTO dto = new InvoiceDTO();
        dto.setId(invoice.getId());
        dto.setOrderId(invoice.getOrderId());
        dto.setCustomerName(invoice.getCustomerName());
        dto.setTotalAmount(invoice.getTotalAmount());
        dto.setDate(invoice.getDate().toString());
        return dto;
    }
}