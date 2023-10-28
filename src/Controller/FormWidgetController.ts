import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { connectRabbitMQ, publishMessage } from "../config/AMWPConfig";

const prisma = new PrismaClient();

export class FormWidgetController {
  async createWidget(req: Request, res: Response) {
    try {
      const userId = req.currentUser?.id as string;
      const {
        formWidget
      } = req.body;
console.log(req.body)
      const newFormWidget = await prisma.formWidget.create({
        data: {
          userId:userId ,
          backgroundColor: formWidget.backgroundColor,
        },
      });

      const elementsData = [
        {
          label: formWidget.fields.Title.label,
          fontSize: formWidget.fields.Title.fontSize,
          fontFamily: formWidget.fields.Title.fontFamily,
          bold: formWidget.fields.Title.bold,
          underline:formWidget.fields. Title.underline,
          fontColor: formWidget.fields.Title.fontColor,
          typeElementName: "Title",
          formWidgetId: newFormWidget.id,
        },
        {
          label: formWidget.fields.Subtitle.label,
          fontSize: formWidget.fields.Subtitle.fontSize,
          fontFamily: formWidget.fields.Subtitle.fontFamily,
          bold: formWidget.fields.Subtitle.bold,
          underline: formWidget.fields.Subtitle.underline,
          fontColor: formWidget.fields.Subtitle.fontColor,
          typeElementName: "Subtitle",
          formWidgetId: newFormWidget.id,
        },
        {
          label: formWidget.fields.Button.label,
          fontSize: formWidget.fields.Button.fontSize,
          fontFamily: formWidget.fields.Button.fontFamily,
          bold: formWidget.fields.Button.bold,
          underline: formWidget.fields.Button.underline,
          fontColor: formWidget.fields.Button.fontColor,
          backgroundColor: formWidget.fields.Button.backgroundColor,
          borderRadius: formWidget.fields.Button.borderRadius,
          typeElementName: "Button",
          formWidgetId: newFormWidget.id,
        },
        {
          label: formWidget.fields.FirstNameInput.label,
          fontSize: formWidget.fields.FirstNameInput.fontSize,
          fontFamily: formWidget.fields.FirstNameInput.fontFamily,
          isRequired: formWidget.fields.FirstNameInput.isRequired,
          showInput: formWidget.fields.FirstNameInput.showInput,
          typeElementName: "FirstNameInput",
          formWidgetId: newFormWidget.id,
        },
        {
          label: formWidget.fields.LastNameInput.label,
          fontSize: formWidget.fields.LastNameInput.fontSize,
          fontFamily: formWidget.fields.LastNameInput.fontFamily,
          isRequired: formWidget.fields.LastNameInput.isRequired,
          showInput: formWidget.fields.LastNameInput.showInput,
          typeElementName: "LastNameInput",
          formWidgetId: newFormWidget.id,
        },
        {
          label: formWidget.fields.EmailInput.label,
          fontSize: formWidget.fields.EmailInput.fontSize,
          fontFamily: formWidget.fields.EmailInput.fontFamily,
          isRequired: formWidget.fields.EmailInput.isRequired,
          showInput: formWidget.fields.EmailInput.showInput,
          typeElementName: "EmailInput",
          formWidgetId: newFormWidget.id,
        },
        {
          label: formWidget.fields.Checkbox.label,
          isRequired: formWidget.fields.Checkbox.isRequired,
          showInput: formWidget.fields.Checkbox.showInput,
          typeElementName: "Checkbox",
          formWidgetId: newFormWidget.id,
        }, {
          label: formWidget.fields.RadioButton.label,
          isRequired: formWidget.fields.RadioButton.isRequired,
          showInput: formWidget.fields.RadioButton.showInput,
          typeElementName: "RadioButton",
          formWidgetId: newFormWidget.id,
        }, 
      ];

      const dropdownOptions = formWidget.fields.Dropdown.dropdownOptions.map((option: { label: string; show: boolean; }) => {
        return {
          label: option.label,
          show: option.show,
        };
      });

       await prisma.element.create({
        data: {
          showInput:formWidget.fields.Dropdown.showInput,
          typeElementName: "Dropdown",
          formWidgetId: newFormWidget.id,
          dropdownOptions: {
            createMany: {
              data: dropdownOptions
            },
          },
        },
      });

      await prisma.element.createMany({
        data: elementsData,
      });

      const updatedFormWidget = await prisma.formWidget.findUnique({
        where: {
          id: newFormWidget.id,
        },
        include: {
          elements: {
            include:{
              dropdownOptions: true
            }
          },

        },
      });
      const channel = await connectRabbitMQ();

      await publishMessage(channel, updatedFormWidget);

      return res.status(201).json(updatedFormWidget);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }

  async createElementTypes(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const elementType = await prisma.fieldType.create({
        data: {
          name: name,
        },
      });

      return res.status(201).json(elementType);
    } catch (err) {
      console.log(err);
    }
  }

  async getFormWidget(req: Request, res: Response) {
    return res.sendFile(
      `C:\\Users\\berna\\OneDrive\\Área de Trabalho\\viral-loops-api\\src\\widgets\\${req.params.id}.html`
    );
  }
}
