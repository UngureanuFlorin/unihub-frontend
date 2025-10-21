import React from "react";
import { Card, Row, Col, Select, DatePicker, Space, Tag } from "antd";
const { RangePicker } = DatePicker;

export default function Filters({ value, onChange, onQuickTag }) {
    const set = (patch) => onChange({ ...value, ...patch });

    return (
        <Card style={{ marginTop: 16 }}>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Categoria"
                        value={value.category}
                        options={[
                            { value: "", label: "Tutte le categorie" },
                            { value: "accademico", label: "Accademico" },
                            { value: "sport", label: "Sport" },
                            { value: "cultura", label: "Cultura" },
                            { value: "carriera", label: "Carriera" },
                            { value: "volontariato", label: "Volontariato" },
                        ]}
                        onChange={(v) => set({ category: v })}
                    />
                </Col>
                <Col xs={24} md={8}>
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Ateneo"
                        value={value.university}
                        options={[
                            { value: "", label: "Tutti gli atenei" },
                            { value: "unimi", label: "Università degli Studi di Milano" },
                            { value: "polimi", label: "Politecnico di Milano" },
                        ]}
                        onChange={(v) => set({ university: v })}
                    />
                </Col>
                <Col xs={24} md={8}>
                    <RangePicker
                        style={{ width: "100%" }}
                        showTime
                        value={value.dateRange}
                        onChange={(v) => set({ dateRange: v })}
                    />
                </Col>
            </Row>

            <Space size="small" style={{ marginTop: 12 }}>
                <Tag onClick={() => onQuickTag?.("#hackathon")} color="blue" style={{ cursor: "pointer" }}>
                    #hackathon
                </Tag>
                <Tag onClick={() => onQuickTag?.("#jobfair")} color="green" style={{ cursor: "pointer" }}>
                    #jobfair
                </Tag>
                <Tag onClick={() => onQuickTag?.("#musica")} color="magenta" style={{ cursor: "pointer" }}>
                    #musica
                </Tag>
            </Space>
        </Card>
    );
}
