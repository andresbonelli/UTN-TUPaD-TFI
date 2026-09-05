package com.tup.tfi.emergencias107.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString
@MappedSuperclass
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    protected Long id;

    @Builder.Default
    @Column(name = "created_at", nullable = false)
    protected LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    @Column(name = "updated_at", nullable = false)
    protected LocalDateTime updatedAt = LocalDateTime.now();
}
