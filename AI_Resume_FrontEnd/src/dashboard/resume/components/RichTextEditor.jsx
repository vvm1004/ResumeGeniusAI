import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import React, { useContext, useState } from 'react'
import { BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic, BtnLink, BtnNumberedList, BtnStrikeThrough, BtnStyles, BtnUnderline, Editor, EditorProvider, HtmlButton, Separator, Toolbar } from 'react-simple-wysiwyg'
import { AIChatSession } from './../../../../service/AIModal2.js';
import { toast } from 'sonner';
const PROMPT = 'position titile: {positionTitle} , Depends on position title give me 5-7 bullet points for my experience in resume (Please do not add experince level and No JSON array) , give me result in HTML tags'
function RichTextEditor({ onRichTextEditorChange, index, defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const [loading, setLoading] = useState(false);
  // const GenerateSummeryFromAI = async () => {
  //   if (!resumeInfo?.experience[index]?.title) {
  //     toast('Please Add Position Title');
  //     return;
  //   }

  //   setLoading(true);
  //   const prompt = PROMPT.replace('{positionTitle}', resumeInfo.experience[index].title);

  //   try {
  //     const result = await AIChatSession.sendMessage(prompt);
  //     const responseText = result.response.text();
  //     console.log(responseText); // Log the response text to check its content

  //     // Ensure the response is JSON
  //     let jsonResponse;
  //     try {
  //       jsonResponse = JSON.parse(responseText);
  //     } catch (e) {
  //       console.error('Invalid JSON response:', e);
  //       setLoading(false);
  //       return;
  //     }

  //     if (jsonResponse.experience_bullets) {
  //       const htmlContent = `
  //         <ul>
  //           ${jsonResponse.experience_bullets.map(bullet => `<li>${bullet}</li>`).join('')}
  //         </ul>
  //       `;
  //       setValue(htmlContent);
  //     }
  //     if (jsonResponse.experience) {
  //       const htmlContent = `
  //       <ul>
  //         ${Array.isArray(jsonResponse.experience) ? jsonResponse.experience.map(bullet => `<li>${bullet}</li>`).join('') : ''}
  //       </ul>
  //     `;
  //       setValue(htmlContent);
  //     }

  //   } catch (error) {
  //     console.error('Error generating summary:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const GenerateSummeryFromAI = async () => {

    if (!resumeInfo?.experience[index]?.title) {
      toast('Please Add Position Title');
      return;
    }
    setLoading(true)
    const prompt = PROMPT.replace('{positionTitle}', resumeInfo.experience[index].title);

    const result = await AIChatSession.sendMessage(prompt);
    console.log(result.response.text());
    const resp = result.response.text()
    setValue(resp.replace('[', '').replace(']', ''));
    setLoading(false);
  }

  return (
    <div>
      <div className='flex justify-between my-2'>
        <label className='text-xs'>Summery</label>
        <Button variant="outline" size="sm"
          onClick={GenerateSummeryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary">
          {loading ?
            <LoaderCircle className='animate-spin' /> :
            <>
              <Brain className='h-4 w-4' /> Generate from AI
            </>
          }
        </Button>
      </div>
      <EditorProvider>
        <Editor value={value} onChange={(e) => {
          setValue(e.target.value);
          onRichTextEditorChange(e)
        }}>
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />


          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  )
}

export default RichTextEditor